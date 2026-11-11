# Simarpreet Singh — Portfolio

A fast, zero-backend portfolio. Plain HTML + CSS + JS, no build step, no framework.
Hosts free on **Vercel** or **GitHub Pages**.

```
.
├── content.js      ← ✏️ EDIT THIS — every word, job, project, link and stat
├── index.html      ← page skeleton (rarely needs changes)
├── styles.css      ← design (colors & fonts are tokens at the top)
├── main.js         ← renders content.js into the page (no need to touch)
├── assets/
│   ├── img/        ← portrait.jpg, night.jpg, favicon.svg
│   └── docs/       ← Simarpreet-Singh-Resume.pdf
├── 404.html        ← "page not found" page
├── scripts/build-seo.js ← builds the SEO & AI files (runs on deploy)
├── llms.txt, llms-full.txt, profile.json, sitemap.xml, robots.txt ← generated
├── vercel.json
└── .nojekyll       ← tells GitHub Pages to serve files as-is
```

## ✏️ Updating the site

Everything lives in **`content.js`**. Edit it (even straight on github.com with the pencil icon), commit, and the site redeploys in under a minute.

### Where to edit — jump to a section

Open `content.js` and search (Ctrl/Cmd + F) for the marker. Every section starts with a comment that explains its fields and shows a copy-paste example.

| On the website | Search `content.js` for |
|---|---|
| Accent colour (daily swap, orange or blue) | `✏️ EDIT: THEME` |
| Browser tab title, name, email, résumé | `✏️ EDIT: BASICS` |
| Status bar, big headline, intro, stickers | `✏️ EDIT: HERO` |
| Six big numbers | `✏️ EDIT: STATS` |
| "Worked with · spoke at" names in the black scrolling strip | `✏️ EDIT: LOGOS` |
| "Who am I" text and photo | `✏️ EDIT: ABOUT` |
| "What I bring to any dev team" cards + "Also at home in" badges | `✏️ EDIT: PLAYBOOK` |
| Jobs / roles | `✏️ EDIT: WORK` |
| Origin story in chapters (newest first) | `✏️ EDIT: LORE` |
| Project cards + rotating ring with Quick Look | `✏️ EDIT: PROJECTS` |
| Article magazine (cover, 2 features, then "page 2") | `✏️ EDIT: ARTICLES` |
| Simar's TV and the "Mic check" puzzle | `✏️ EDIT: VIDEOS` |
| X posts on the cork board | `✏️ EDIT: X POSTS` |
| Skills (shown inside the Playbook section) | `✏️ EDIT: TOOLKIT` |
| Quotes from people you've worked with | `✏️ EDIT: TESTIMONIALS` |
| Contact text, the two "open to" doors, form | `✏️ EDIT: CONTACT` |
| Social links | `✏️ EDIT: SOCIALS` |

> **If the page goes blank after an edit**, a missing comma `,` or quote `"` is almost always the cause. Compare your line with the one above it.

### Common tasks

| I want to… | Do this in `content.js` |
|---|---|
| Change my current role / status line | edit `status` and the first item in `experience.items` |
| Add a new job | copy a `{ company, role, period, … }` block to the **top** of `experience.items`; set `current: true` on it and remove it from the old one |
| Add a moment to the origin story | add `{ year, when, title, text, url }` at the **top** of `lore.items` (newest first); it lands in the chapter whose `years` include it (see `lore.chapters`; add a chapter when a new era starts). Two links? use `links: [{ label, url }, …]` |
| Choose the colour | `accent: "daily"` (orange and blue swap every 24 h), `"orange"` or `"blue"`. Visitors can override it in the footer: flip the coin or pick a side |
| Link words inside a job bullet | write `[the words](https://…)` in the bullet text |
| Show a promotion inside a job | add `stepUp: { company, url, role, period, points, tags }` to that job (see Tezos India → Etherlink) |
| Change how many bullets show per job | `experience.showPoints` (laptop) and `showPointsPhone` (phone); the rest sit behind "Show more" but stay in the page for Google and AI. `compact: true` turns a role into a slim row |
| Add a project | add `{ name, topic, kind, text, url }` to `projects.items`. `topic` is `"web2"`, `"web3"` or `"ai"` and drives the All / Web2 / Web3 / AI & ML filter (articles and toolkit groups use the same field). The first `projects.featured` items are big cards; the rest go on the ring |
| Add an article | add `{ title, kicker, date, read, url, image, stats }` to `articles.items` — the **first** item is the cover story, items 2–3 sit beside it, the rest go on "page 2" where the one with the most stats leads (or mark one `lead: true`). Stats are typed in by hand |
| Change the top menu | edit `menu` (`"#work"` jumps to a home section, `"talks/"` opens a page) |
| Change the extra pages | edit `pages`: which sections each page shows, plus its Google title and description. The page files (`talks/index.html` …) are rebuilt automatically on every deploy; locally run `node scripts/build-seo.js` |
| Add a YouTube video to Simar's TV | add `{ id, title, duration }` to a channel in `videos.channels` (id = the part after `?v=`) |
| Show a video in the "Mic check" puzzle | add `featured: true` to it (the puzzle is designed for 5 pieces) |
| Add a new TV channel / playlist | copy a `{ name, blurb, playlist, items }` block into `videos.channels` |
| Add / pin an X post | add `{ url }` to `posts.items` (Share → Copy link on X); add `pinned: true` for the big PINNED note. Copy the post text into `text` (and `date`, `likes`, `video`) — that is what the note shows. `posts.showFirst` sets how many notes show before "Show more" |
| Update numbers | edit `stats` |
| Change "open to" | edit `hero.availability` (line under the hero buttons) and `contact.openTo` (the two doors; clicking one fills in the reason on the form) |
| Change the link-preview images | replace `assets/img/og.jpg` (home) or `og-talks.jpg`, `og-writing.jpg`, `og-story.jpg` (1200×630 each). The file names are set in `meta.ogImage` and each page's `ogImage` in content.js |
| Hide a section | set `show: false` on it (its nav link disappears too) |
| Swap a résumé | replace the PDF in `assets/docs/` (keep the file name). In `hero.secondaryCta.options` the **first** file is the one-click button, the others show as a small "or …" link |
| Add a testimonial | add `{ quote, name, role, url }` to `testimonials.items`; the section appears once there is at least one |
| Swap photos | hero: replace `assets/img/portrait.jpg` (4:5 ratio). About: change `about.photo` to a file in `assets/img/` or any image URL |

Text formatting inside any title: `*word*` → blue hand-drawn underline, `~word~` → orange highlight block.

To change colors or fonts, edit the variables at the top of `styles.css` (`--blue`, `--hot`, `--f-display`, …).

## 🔎 Search engines & AI assistants

The page is drawn by JavaScript, but many AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't run JavaScript. So a small build step, `scripts/build-seo.js`, reads `content.js` and writes:

| File | What it's for |
|---|---|
| `index.html` (between `SEO:START`/`SEO:END` and inside each section) | Title, description, canonical URL, Open Graph/Twitter cards, **JSON-LD structured data** (Person + ProfilePage), and a plain-text copy of every section that crawlers can read without JavaScript |
| `llms.txt`, `llms-full.txt` | Your profile in Markdown, the emerging standard AI assistants look for |
| `profile.json` | Machine-readable résumé (JSON Resume format) |
| `sitemap.xml` | List of pages for Google/Bing |
| `robots.txt` | Allows everyone, and names Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot and others explicitly |
| `404.html` | Friendly "page not found" page (Vercel and GitHub Pages use it automatically) |

**It runs automatically:** Vercel runs it on every deploy (`vercel.json → buildCommand`). On GitHub Pages, the workflow in `.github/workflows/seo.yml` runs it after each push and commits the result. You can also run it yourself with `node scripts/build-seo.js`.

**Edit** the search title, description, target roles and keywords in `content.js → meta`.

### After your first deploy (10 minutes, once)
1. Set `meta.url` in `content.js` to the real live address and redeploy. Canonical links, sitemap and structured data all use it.
2. **Google Search Console** → add the site → verify → *Sitemaps* → submit `sitemap.xml` → *URL inspection* → *Request indexing*.
3. **Bing Webmaster Tools** → *Import from Google Search Console*. Bing's index also feeds ChatGPT search and Microsoft Copilot.
4. Put the site link on **LinkedIn** (Contact info + Featured), **X bio**, **GitHub profile**, **bio.link**, **Medium** and **YouTube** "About". These links are what tell search engines the site is really you, and they matter more than any tag.
5. Check the structured data with Google's [Rich Results Test](https://search.google.com/test/rich-results).

> Searching your **name** should put this site near the top within days to weeks of indexing. Ranking first for broad phrases like "developer advocate" depends on links and activity across the web, which no website file can guarantee. Keep posting, speaking and linking back here.

## 📬 Contact form

Uses the same Formspree form as the old site (`https://formspree.io/f/mayakpra`), so messages keep landing in the same Formspree inbox/email. It's set in `content.js → contact.formspree`. Submissions are sent with `fetch` — no page reload, no backend. A hidden `_gotcha` honeypot field filters bots.

> After deploying, open the Formspree dashboard → your form → **Settings → Restrict to domain** and add your new domain if domain restriction is on.

## 🚀 Deploy

### Option A — Vercel (recommended)
1. Create a new GitHub repo (e.g. `portfolio`) and push these files.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Build command: *none*. Output directory: `./` → **Deploy**.
4. Every push to `main` redeploys automatically. Add a custom domain under **Settings → Domains** if you want one.

### Option B — GitHub Pages
1. Push to a repo → **Settings → Pages** → Source: **Deploy from a branch** → `main` / `root`.
2. Live at `https://simarpreetsingh-019.github.io/<repo-name>/` in ~1 minute.

(To make it your main `simarpreetsingh-019.github.io` site later, copy these files into that repo.)

Remember to update `meta.url` in `content.js` once you know the final URL.

## ▶️ About YouTube "Error 153"

YouTube's embedded player refuses to start when it can't tell which website is embedding it (it reads the browser's `Referer` header). Pages opened straight from disk (`file://…/index.html`) send no Referer, so the player shows **Error 153 · Video player configuration error**. The site now:

- sends `referrerpolicy="strict-origin-when-cross-origin"` on the player and the page, plus an `origin=` parameter, so the player always knows the site;
- detects `file://` and shows a short note with an "Open on YouTube" link instead of a broken player.

On Vercel, GitHub Pages or `localhost` the videos play inside the TV.

## 🧪 Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
(Double-clicking `index.html` also works, but YouTube refuses to play embeds from `file://`, so use the server above to test Simar's TV.)

## 🗂 Pages
The site is a short home page plus three extra pages, all built from `content.js`:

| Page | Shows | File |
|---|---|---|
| Home `/` | hero, about, playbook + toolkit, work, projects, links to the pages below, contact | `index.html` |
| Talks `/talks/` | Simar's TV and the "Mic check" puzzle | `talks/index.html` (generated) |
| Writing `/writing/` | the article magazine | `writing/index.html` (generated) |
| Story `/story/` | lore chapters and the X cork board | `story/index.html` (generated) |

Don't edit the generated page files by hand: `scripts/build-seo.js` rewrites them from `index.html` + `content.js`. Old links such as `/#videos` or `/#lore` forward to the right page automatically.

## ✨ Features
- Neo-brutalist layout (grid paper, thick borders, hard shadows) with editorial serif accents and hand-drawn underlines
- "Simar's TV": a retro TV player with channels (playlists), a TV guide, prev/next/CH+ keys and a "Mic check" puzzle of interlocking pieces. Videos play inside the page via privacy-friendly youtube-nocookie embeds
- Light/dark mode (follows system, remembers the visitor's toggle)
- Fully responsive, reduced-motion friendly, keyboard accessible
- Scroll reveals, marquee, sticker details — all CSS/vanilla JS, ~20 KB total code
