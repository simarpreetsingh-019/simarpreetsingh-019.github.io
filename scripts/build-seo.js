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
  (p.alsoAt ? `<h3>Also at home in</h3><ul>${p.alsoAt.map((x) => `<li><strong>${esc(x.title)}</strong>: ${esc(x.text)}</li>`).join("")}</ul>` : "") + `</div>`;
PRE.experience = (e) => `<div class="wrap pre"><h2>Work experience</h2>${e.items.map((j) =>
  `<article><h3>${esc(j.role)}, ${esc(j.company)}</h3><p>${esc(j.period)}${j.location ? " · " + esc(j.location) : ""}</p><ul>${(j.points || []).map((x) => `<li>${linksHtml(x)}</li>`).join("")}</ul></article>`).join("")}</div>`;
PRE.lore = (l) => `<div class="wrap pre"><h2>Origin story (timeline)</h2><ul>${l.items.map((it) =>
  `<li><strong>${esc(it.when ? it.when + " " : "")}${esc(it.year)}: ${esc(it.title)}.</strong> ${esc(it.text)}${it.url ? ` <a href="${esc(it.url)}">Link</a>` : ""}</li>`).join("")}</ul></div>`;
PRE.projects = (p) => `<div class="wrap pre"><h2>Projects</h2><ul>${p.items.map((it) =>
  `<li><h3>${it.url ? `<a href="${esc(it.url)}">${esc(it.name)}</a>` : esc(it.name)}</h3><p>${esc(it.kind)}. ${esc(it.text)}</p></li>`).join("")}</ul></div>`;
PRE.articles = (a) => `<div class="wrap pre"><h2>Articles</h2><ul>${a.items.map((it) =>
  `<li><a href="${esc(it.url)}">${esc(it.title)}</a> (${esc(it.kicker)}, ${esc(it.date)})${it.dek ? ": " + esc(it.dek) : ""}</li>`).join("")}</ul></div>`;
PRE.videos = (v) => `<div class="wrap pre"><h2>Videos and talks</h2><p>${esc(v.text)}</p>${v.channels.map((c) =>
  `<h3>${esc(c.name)}</h3><ul>${c.items.map((it) => `<li><a href="https://www.youtube.com/watch?v=${esc(it.id)}">${esc(it.title)}</a>${it.by ? " (" + esc(it.by) + ")" : ""}</li>`).join("")}</ul>`).join("")}</div>`;
PRE.posts = (x) => `<div class="wrap pre"><h2>Posts on X</h2><ul>${x.items.map((t) =>
  `<li><a href="${esc(t.url)}">${esc(t.date || "Post")}</a>${t.text ? ": " + esc(t.text) : ""}</li>`).join("")}</ul></div>`;
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
  image: abs(M.ogImage || P.photo),
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

// ---- head block ------------------------------------------------------------
const head = `<!-- SEO:START (generated by scripts/build-seo.js — edit content.js instead) -->
  <title>${esc(M.title)}</title>
  <meta name="description" content="${esc(M.description)}" />
  <meta name="keywords" content="${esc((M.keywords || []).join(", "))}" />
  <meta name="author" content="${esc(FULL_NAME)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${esc(SITE_URL)}/" />
  <link rel="alternate" type="text/markdown" title="Profile for AI assistants" href="${esc(SITE_URL)}/llms.txt" />
  <link rel="alternate" type="application/json" title="Résumé (JSON Resume)" href="${esc(SITE_URL)}/profile.json" />
  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="${esc(FULL_NAME)}" />
  <meta property="og:title" content="${esc(M.title)}" />
  <meta property="og:description" content="${esc(M.description)}" />
  <meta property="og:url" content="${esc(SITE_URL)}/" />
  <meta property="og:image" content="${esc(abs(M.ogImage || P.photo))}" />
  <meta property="og:image:alt" content="${esc(P.photoAlt || FULL_NAME)}" />
  <meta property="profile:first_name" content="${esc(P.firstName)}" />
  <meta property="profile:last_name" content="${esc(P.lastName)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@simarpreet_019" />
  <meta name="twitter:title" content="${esc(M.title)}" />
  <meta name="twitter:description" content="${esc(M.description)}" />
  <meta name="twitter:image" content="${esc(abs(M.ogImage || P.photo))}" />
  <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>
  <!-- SEO:END -->`;

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
html = html.replace(/<img data-fill="photo" alt="[^"]*"/, `<img data-fill="photo" src="${esc(P.photo)}" alt="${esc(P.photoAlt || FULL_NAME)}"`);

// sections
html = html.replace(/(<section[^>]*data-section="(\w+)"[^>]*>)([\s\S]*?)(<\/section>)/g, (m, open, key, _inner, close) => {
  if (!shown(key) || !PRE[key]) return open + close;
  return open + PRE[key](S[key]) + close;
});
write("index.html", html);

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

${S.about.paragraphs.join("\n\n")}

## Key numbers
${statsMd}

## Current and recent roles
${S.experience.items.map((j) => `- ${j.role}, ${j.company} (${j.period})`).join("\n")}

## Links
${socialsMd}
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
${S.experience.items.map((j) => `### ${j.role} — ${j.company}\n${j.period}${j.location ? " · " + j.location : ""}${j.url ? "\n" + j.url : ""}\n${(j.points || []).map((x) => "- " + mdLinks(x)).join("\n")}`).join("\n\n")}

## Timeline
${S.lore.items.map((it) => `- ${it.when ? it.when + " " : ""}${it.year} — ${it.title}: ${it.text}${it.url ? " (" + it.url + ")" : ""}`).join("\n")}

## Projects
${S.projects.items.map((p) => `- **${p.name}** (${p.kind}) — ${p.text}${p.url ? " " + p.url : ""}`).join("\n")}

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
  work: S.experience.items.map((j) => ({ name: j.company, position: j.role, url: j.url, ...parsePeriod(j.period), highlights: (j.points || []).map(plain) })),
  education: [{ institution: "Guru Tegh Bahadur Institute of Technology, GGSIP University", area: "Computer Science and Engineering", studyType: "B.Tech", startDate: "2018-08", endDate: "2022-08" }],
  skills: S.skills.groups.map((g) => ({ name: g.name, keywords: g.items })),
  projects: S.projects.items.map((p) => ({ name: p.name, description: p.text, url: p.url, keywords: [p.kind] })),
  publications: S.articles.items.map((a) => ({ name: a.title, url: a.url, releaseDate: a.date })),
  meta: { lastModified: TODAY },
};
write("profile.json", JSON.stringify(resume, null, 2) + "\n");

// ---- sitemap + robots ---------------------------------------------------------
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
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
