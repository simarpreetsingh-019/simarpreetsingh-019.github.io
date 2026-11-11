#!/usr/bin/env node
/* =====================================================================
   SEO + AI build step — no dependencies, just Node 18+.
   Run:  node scripts/build-seo.js
   (Vercel runs it automatically on every deploy; see vercel.json.
    GitHub Pages: the workflow in .github/workflows/seo.yml runs it.)

   Reads content.js and writes:
     • index.html   → pre-rendered text of every section (so crawlers that
                      don't run JavaScript — GPTBot, ClaudeBot, PerplexityBot —
                      still read the whole profile), plus title, meta tags,
                      Open Graph and JSON-LD structured data
     • llms.txt     → short Markdown profile for AI assistants
     • llms-full.txt→ the full profile in Markdown
     • profile.json → machine-readable résumé (JSON Resume format)
     • sitemap.xml, robots.txt
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const write = (f, s) => { fs.writeFileSync(path.join(ROOT, f), s); console.log("  wrote", f); };

// ---- load content.js ----------------------------------------------------
const sandbox = { window: {} };
vm.runInNewContext(read("content.js"), sandbox);
const S = sandbox.window.SITE;
if (!S) throw new Error("content.js did not define window.SITE");

const P = S.person, M = S.meta;
const SITE_URL = (M.url || "").replace(/\/$/, "");
const TODAY = new Date().toISOString().slice(0, 10);
const FULL_NAME = P.firstName + " " + P.lastName;

// ---- helpers --------------------------------------------------------------
const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s) => String(s || "").replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, "$1").replace(/[*~]/g, "");
const linksHtml = (s) => esc(s).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
const mdLinks = (s) => String(s || "").replace(/[*~]/g, "");
const abs = (u) => (/^https?:/.test(u) ? u : SITE_URL + "/" + String(u).replace(/^\//, ""));
const shown = (k) => S[k] && S[k].show !== false;

// ---- pre-rendered section HTML (semantic, lightweight) ---------------------
const PRE = {};
PRE.about = (a) => `<div class="wrap pre"><h2>${esc(plain(a.title))}</h2>${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
PRE.playbook = (p) => `<div class="wrap pre"><h2>${esc(plain(p.title))}</h2><p>${esc(p.text || "")}</p><ul>${p.cards.map((c) =>
  `<li><h3>${esc(c.skill)}: ${esc(c.value)} ${esc(c.unit)}</h3><p>${esc(c.text)}</p></li>`).join("")}</ul>` +
  (S.skills ? `<h3>Toolkit</h3>${S.skills.groups.map((g) => `<p><strong>${esc(g.name)}:</strong> ${g.items.map(esc).join(", ")}</p>`).join("")}` : "") +
  (p.alsoAt ? `<h3>Also at home in</h3><ul>${p.alsoAt.map((x) => `<li><strong>${esc(x.title)}</strong>: ${esc(x.text)}</li>`).join("")}</ul>` : "") + `</div>`;
// every job, including step-ups (promotions) inside a job, as its own article
const jobs = (e) => [].concat(...e.items.map((j) => (j.stepUp ? [j, Object.assign({ location: j.location }, j.stepUp)] : [j])));
PRE.experience = (e) => `<div class="wrap pre"><h2>Work experience</h2>${e.text ? `<p>${esc(e.text)}</p>` : ""}${jobs(e).map((j) =>
  `<article><h3>${esc(j.role)}, ${esc(j.company)}</h3><p>${esc(j.period)}${j.location ? " · " + esc(j.location) : ""}</p><ul>${(j.points || []).map((x) => `<li>${linksHtml(x)}</li>`).join("")}</ul></article>`).join("")}</div>`;
PRE.lore = (l) => `<div class="wrap pre"><h2>Origin story (timeline)</h2>${l.text ? `<p>${esc(l.text)}</p>` : ""}<ul>${l.items.map((it) =>
  `<li><strong>${esc(it.when ? it.when + " " : "")}${esc(it.year)}: ${esc(it.title)}.</strong> ${esc(it.text)}${it.url ? ` <a href="${esc(it.url)}">Link</a>` : ""}</li>`).join("")}</ul></div>`;
PRE.projects = (p) => `<div class="wrap pre"><h2>Projects</h2><ul>${p.items.map((it) =>
  `<li><h3>${it.url ? `<a href="${esc(it.url)}">${esc(it.name)}</a>` : esc(it.name)}</h3><p>${esc(it.kind)}. ${esc(it.text)}${it.stack ? " Built with: " + it.stack.map(esc).join(", ") + "." : ""}</p></li>`).join("")}</ul></div>`;
PRE.articles = (a) => `<div class="wrap pre"><h2>Articles</h2><ul>${a.items.map((it) =>
  `<li><a href="${esc(it.url)}">${esc(it.title)}</a> (${esc(it.kicker)}, ${esc(it.date)})${it.dek ? ": " + esc(it.dek) : ""}</li>`).join("")}</ul></div>`;
PRE.videos = (v) => `<div class="wrap pre"><h2>Videos and talks</h2><p>${esc(v.text)}</p>${v.channels.map((c) =>
  `<h3>${esc(c.name)}</h3><ul>${c.items.map((it) => `<li><a href="https://www.youtube.com/watch?v=${esc(it.id)}">${esc(it.title)}</a>${it.by ? " (" + esc(it.by) + ")" : ""}</li>`).join("")}</ul>`).join("")}</div>`;
PRE.posts = (x) => `<div class="wrap pre"><h2>Posts on X</h2><ul>${x.items.map((t) =>
  `<li><a href="${esc(t.url)}">${esc(t.date || "Post")}</a>${t.text ? ": " + esc(t.text) : ""}</li>`).join("")}</ul></div>`;
PRE.explore = () => `<div class="wrap pre"><h2>More on other pages</h2><ul>${PAGES.map((pg) => `<li><a href="${esc(pg.path)}">${esc(pg.label)}</a>: ${esc(pg.teaser || pg.description)}</li>`).join("")}</ul></div>`;
PRE.testimonials = (t) => (t.items || []).filter((q) => q.quote).length ? `<div class="wrap pre"><h2>Testimonials</h2>${t.items.filter((q) => q.quote).map((q) => `<blockquote><p>${esc(q.quote)}</p><footer>${esc(q.name)}${q.role ? ", " + esc(q.role) : ""}</footer></blockquote>`).join("")}</div>` : "";
PRE.skills = (s) => `<div class="wrap pre"><h2>Skills</h2>${s.groups.map((g) => `<h3>${esc(g.name)}</h3><p>${g.items.map(esc).join(", ")}</p>`).join("")}</div>`;

// ---- structured data (JSON-LD) ----------------------------------------------
const sameAs = (S.socials || []).map((x) => x.url);
const current = (S.experience.items || []).find((j) => j.current);
const knowsAbout = [...new Set([].concat(
  (M.keywords || []),
  ...(S.skills ? S.skills.groups.map((g) => g.items) : [])
))].slice(0, 60);
const person = {
  "@type": "Person",
  "@id": SITE_URL + "/#person",
  name: FULL_NAME,
  alternateName: ["Simar", "simarpreet_019", "simarpreetsingh019"],
  url: SITE_URL + "/",
  image: abs(P.photo),
  email: "mailto:" + P.email,
  jobTitle: (M.roles || [])[0] || "Developer Advocate",
  hasOccupation: (M.roles || []).map((r) => ({ "@type": "Occupation", name: r })),
  description: M.description,
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  knowsAbout,
  sameAs,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Guru Tegh Bahadur Institute of Technology (GGSIP University)" },
  ...(current ? { worksFor: { "@type": "Organization", name: current.company, url: current.url } } : {}),
};
const jsonld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ProfilePage", "@id": SITE_URL + "/#page", url: SITE_URL + "/", name: M.title, description: M.description,
      dateModified: TODAY, mainEntity: { "@id": SITE_URL + "/#person" }, inLanguage: "en" },
    person,
    { "@type": "WebSite", "@id": SITE_URL + "/#site", url: SITE_URL + "/", name: FULL_NAME, publisher: { "@id": SITE_URL + "/#person" } },
  ],
};

// ---- head block (one per page) ------------------------------------------------
const PAGES = S.pages || [];
const headFor = (pg) => {
  const url = SITE_URL + "/" + (pg ? pg.path : "");
  const title = pg ? pg.title : M.title, desc = pg ? pg.description : M.description;
  const ld = pg ? {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": url + "#page", url, name: title, description: desc, dateModified: TODAY, inLanguage: "en",
        isPartOf: { "@id": SITE_URL + "/#site" }, about: { "@id": SITE_URL + "/#person" }, author: { "@id": SITE_URL + "/#person" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: pg.label, item: url } ] },
      person,
      { "@type": "WebSite", "@id": SITE_URL + "/#site", url: SITE_URL + "/", name: FULL_NAME, publisher: { "@id": SITE_URL + "/#person" } },
    ],
  } : jsonld;
  return `<!-- SEO:START (generated by scripts/build-seo.js — edit content.js instead) -->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="keywords" content="${esc((M.keywords || []).join(", "))}" />
  <meta name="author" content="${esc(FULL_NAME)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${esc(url)}" />
  <link rel="alternate" type="text/markdown" title="Profile for AI assistants" href="${esc(SITE_URL)}/llms.txt" />
  <link rel="alternate" type="application/json" title="Résumé (JSON Resume)" href="${esc(SITE_URL)}/profile.json" />
  <meta property="og:type" content="${pg ? "website" : "profile"}" />
  <meta property="og:site_name" content="${esc(FULL_NAME)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:image" content="${esc(abs((pg && pg.ogImage) || M.ogImage || P.photo))}" />
  <meta property="og:image:type" content="image/${/\.png$/.test((pg && pg.ogImage) || M.ogImage || "") ? "png" : "jpeg"}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(pg ? title : FULL_NAME + " — " + (M.roles || []).slice(0, 2).join(", "))}" />
  <meta property="profile:first_name" content="${esc(P.firstName)}" />
  <meta property="profile:last_name" content="${esc(P.lastName)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@simarpreet_019" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${esc(abs((pg && pg.ogImage) || M.ogImage || P.photo))}" />
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
  <!-- SEO:END -->`;
};
const head = headFor(null);

// ---- write index.html --------------------------------------------------------
let html = read("index.html");
if (html.includes("<!-- SEO:START")) html = html.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, head);
else html = html.replace(/  <title>[\s\S]*?<meta name="twitter:card"[^>]*>\n/, "  " + head + "\n");

// hero + small fills
const fill = (name, inner) => {
  // <tag … data-fill="name" …> … </tag>  (closing tag matched to the same tag name)
  const re = new RegExp('<(\\w+)([^>]*data-fill="' + name + '"[^>]*)>([\\s\\S]*?)</\\1>');
  html = html.replace(re, (_, tag, attrs) => "<" + tag + attrs + ">" + inner + "</" + tag + ">");
};
const rich = (s) => esc(s).replace(/\*([^*]+)\*/g, "$1").replace(/~([^~]+)~/g, "$1");
fill("status", esc(S.status));
fill("headline", S.hero.headline.map((l) => `<span class="line">${rich(l)}</span>`).join(" "));
fill("intro", esc(S.hero.intro));
fill("stats", S.stats.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join(""));
fill("avail", esc(S.hero.availability || "") + (S.hero.location ? " · " + esc(S.hero.location) : ""));
if (S.logos && S.logos.items) fill("marquee", S.logos.items.map((n) => `<span>${esc(n)}</span>`).join(""));
if (S.contact.openTo) fill("doors", S.contact.openTo.map((d) => `<p><strong>${esc(d.title)}:</strong> ${esc(d.text)}${d.meta ? " (" + esc(d.meta) + ")" : ""}</p>`).join(""));
html = html.replace(/<img data-fill="photo" alt="[^"]*"/, `<img data-fill="photo" src="${esc(P.photo)}" alt="${esc(P.photoAlt || FULL_NAME)}"`);

// sections
html = html.replace(/(<section[^>]*data-section="(\w+)"[^>]*>)([\s\S]*?)(<\/section>)/g, (m, open, key, _inner, close) => {
  if (!shown(key) || !PRE[key]) return open + close;
  return open + PRE[key](S[key]) + close;
});
write("index.html", html);

// ---- extra pages (talks/, writing/, story/ …) --------------------------------------
// Each page reuses the home page's nav, footer and scripts, with its own head and sections.
const SECTION_TAG = {
  videos: 'class="section section--ink" id="videos"',
  articles: 'class="section" id="articles"',
  lore: 'class="section section--blue" id="lore"',
  posts: 'class="section" id="posts"',
  projects: 'class="section" id="projects"',
  experience: 'class="section" id="work"',
  playbook: 'class="section" id="playbook"',
  about: 'class="section" id="about"',
};
PAGES.forEach((pg) => {
  const others = PAGES.filter((x) => x !== pg);
  const main = `<main id="main" class="subpage">
    <nav class="crumbs wrap" aria-label="Breadcrumb"><a href="./">← Home</a><span aria-hidden="true">/</span><span aria-current="page">${esc(pg.label)}</span></nav>
${(pg.sections || []).filter((k) => shown(k) && PRE[k]).map((k) => `    <section ${SECTION_TAG[k] || 'class="section" id="' + k + '"'} data-section="${k}">${PRE[k](S[k])}</section>`).join("\n")}
    <section class="section section--tight pagenav">
      <div class="wrap">
        <p class="label">[ KEEP EXPLORING ]</p>
        <div class="pagenav__links">
          <a class="pagenav__link" href="./"><small>Home</small><b>The short version</b><span>Work, projects and the numbers →</span></a>
${others.map((x) => `          <a class="pagenav__link" href="${esc(x.path)}"><small>${esc(x.label)}</small><b>${esc(x.teaser || "")}</b><span>${esc(x.cta || "Open")} →</span></a>`).join("\n")}
        </div>
        <div class="pagenav__cta">
          <p class="pagenav__title">Building for developers?</p>
          <p class="pagenav__text">${esc(S.hero.availability || "")}${S.hero.location ? " · " + esc(S.hero.location) : ""}</p>
          <p class="pagenav__btns"><a class="btn btn--hot" href="#contact">Let's talk →</a> <a class="pagenav__mail" href="mailto:${esc(P.email)}">${esc(P.email)}</a></p>
        </div>
      </div>
    </section>
  </main>`;
  let page = html
    .replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, headFor(pg))
    .replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n  <base href="../" />')
    .replace(/<body[^>]*>/, `<body data-page="${esc(pg.id)}">`)
    .replace(/<main id="main">[\s\S]*?<\/main>/, main);
  fs.mkdirSync(path.join(ROOT, pg.path), { recursive: true });
  write(pg.path + "index.html", page);
});

if (S.logos && S.logos.items) S.__logos = S.logos.items.join(", ");
// ---- llms.txt / llms-full.txt -------------------------------------------------
const roleLine = (M.roles || []).join(" · ");
const statsMd = S.stats.map((s) => `- ${s.value} ${s.label}`).join("\n");
const socialsMd = S.socials.map((x) => `- ${x.name}: ${x.url}`).join("\n");
const llms = `# ${FULL_NAME}

> ${M.description}

Roles: ${roleLine}
Location: ${P.location}
Email: ${P.email}
Website: ${SITE_URL}/

## Summary
${S.hero.intro}
${S.hero.availability ? "\nAvailability: " + S.hero.availability + "\n" : ""}${(S.contact.openTo || []).map((d) => `- ${d.title}: ${d.text}${d.meta ? " (" + d.meta + ")" : ""}`).join("\n")}

${S.about.paragraphs.join("\n\n")}

## Key numbers
${statsMd}
${S.__logos ? "\nWorked with / spoke at: " + S.__logos + "\n" : ""}

## Current and recent roles
${jobs(S.experience).map((j) => `- ${j.role}, ${j.company} (${j.period})`).join("\n")}

## Links
${socialsMd}
${PAGES.map((pg) => `- ${pg.label}: ${SITE_URL}/${pg.path} (${pg.description})`).join("\n")}
- Full profile for AI assistants: ${SITE_URL}/llms-full.txt
- Résumé (JSON): ${SITE_URL}/profile.json
${(S.hero.secondaryCta.options || []).map((o) => `- ${o.label} (PDF): ${abs(o.href)}`).join("\n")}
`;
write("llms.txt", llms);

const full = llms + `
## What I bring to any developer team
${S.playbook.cards.map((c) => `- **${c.skill}** — ${c.value} ${c.unit}. ${c.text}`).join("\n")}

Also at home in:
${(S.playbook.alsoAt || []).map((x) => `- ${x.title}: ${x.text}`).join("\n")}

## Work experience
${jobs(S.experience).map((j) => `### ${j.role} — ${j.company}\n${j.period}${j.location ? " · " + j.location : ""}${j.url ? "\n" + j.url : ""}\n${(j.points || []).map((x) => "- " + mdLinks(x)).join("\n")}`).join("\n\n")}

## Timeline
${S.lore.items.map((it) => `- ${it.when ? it.when + " " : ""}${it.year} — ${it.title}: ${it.text}${it.url ? " (" + it.url + ")" : ""}`).join("\n")}

## Projects
${S.projects.items.map((p) => `- **${p.name}** (${p.kind}) — ${p.text}${p.stack ? " Built with: " + p.stack.join(", ") + "." : ""}${p.url ? " " + p.url : ""}`).join("\n")}

## Articles
${S.articles.items.map((a) => `- [${a.title}](${a.url}) — ${a.kicker}, ${a.date}`).join("\n")}

## Talks and videos
${S.videos.channels.map((c) => `### ${c.name}\n${c.items.map((v) => `- [${v.title}](https://www.youtube.com/watch?v=${v.id})${v.by ? " — " + v.by : ""}`).join("\n")}`).join("\n\n")}

## Skills
${S.skills.groups.map((g) => `- ${g.name}: ${g.items.join(", ")}`).join("\n")}

_Last updated: ${TODAY}_
`;
write("llms-full.txt", full);

// ---- profile.json (JSON Resume) --------------------------------------------
const parsePeriod = (p) => { const [a, b] = String(p).split(/\s*[—–-]\s*/); return { startDate: a, endDate: /present/i.test(b || "") ? undefined : b }; };
const resume = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: FULL_NAME, label: roleLine, email: P.email, url: SITE_URL + "/", summary: S.hero.intro,
    image: abs(P.photo), location: { city: "New Delhi", countryCode: "IN" },
    profiles: S.socials.map((x) => ({ network: x.name, username: x.handle, url: x.url })),
  },
  work: jobs(S.experience).map((j) => ({ name: j.company, position: j.role, url: j.url, ...parsePeriod(j.period), highlights: (j.points || []).map(plain) })),
  education: [{ institution: "Guru Tegh Bahadur Institute of Technology, GGSIP University", area: "Computer Science and Engineering", studyType: "B.Tech", startDate: "2018-08", endDate: "2022-08" }],
  skills: S.skills.groups.map((g) => ({ name: g.name, keywords: g.items })),
  projects: S.projects.items.map((p) => ({ name: p.name, description: p.text, url: p.url, keywords: [p.kind].concat(p.stack || []) })),
  publications: S.articles.items.map((a) => ({ name: a.title, url: a.url, releaseDate: a.date })),
  meta: { lastModified: TODAY },
};
write("profile.json", JSON.stringify(resume, null, 2) + "\n");

// ---- sitemap + robots ---------------------------------------------------------
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${PAGES.map((pg) => `  <url><loc>${SITE_URL}/${pg.path}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join("\n")}
  <url><loc>${SITE_URL}/llms.txt</loc><lastmod>${TODAY}</lastmod><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/llms-full.txt</loc><lastmod>${TODAY}</lastmod><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/profile.json</loc><lastmod>${TODAY}</lastmod><priority>0.5</priority></url>
${(S.hero.secondaryCta.options || []).map((o) => `  <url><loc>${abs(o.href)}</loc><lastmod>${TODAY}</lastmod><priority>0.5</priority></url>`).join("\n")}
</urlset>
`);

const bots = [
  "Googlebot", "Google-Extended", "Bingbot", "DuckDuckBot", "Applebot", "Applebot-Extended", "YandexBot",
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User", "CCBot", "meta-externalagent", "Amazonbot", "cohere-ai", "MistralAI-User",
];
write("robots.txt", `# Everyone is welcome: search engines and AI assistants alike.
# Generated by scripts/build-seo.js

User-agent: *
Allow: /

${bots.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE_URL}/sitemap.xml
`);

if (/simarpreetsingh\.vercel\.app/.test(SITE_URL)) {
  console.log("\n  ⚠️  meta.url in content.js is still the placeholder (" + SITE_URL + ").\n     Set it to your real live address and run this script again.");
}
console.log("\nDone.");
