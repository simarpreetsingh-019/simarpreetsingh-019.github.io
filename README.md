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
| Scrolling black strip | `✏️ EDIT: MARQUEE` |
| "Who am I" text and photo | `✏️ EDIT: ABOUT` |
| "What I bring to any dev team" cards + "Also at home in" badges | `✏️ EDIT: PLAYBOOK` |
| Jobs / roles | `✏️ EDIT: WORK` |
| Year-by-year origin story (newest first) | `✏️ EDIT: LORE` |
| Project cards | `✏️ EDIT: PROJECTS` |
| Article magazine | `✏️ EDIT: ARTICLES` |
| Simar's TV and highlight reel | `✏️ EDIT: VIDEOS` |
| Posts from X | `✏️ EDIT: X POSTS` |
| Skills | `✏️ EDIT: TOOLKIT` |
| Contact text and form | `✏️ EDIT: CONTACT` |
| Social links | `✏️ EDIT: SOCIALS` |

> **If the page goes blank after an edit**, a missing comma `,` or quote `"` is almost always the cause. Compare your line with the one above it.

### Common tasks

| I want to… | Do this in `content.js` |
|---|---|
| Change my current role / status line | edit `status` and the first item in `experience.items` |
| Add a new job | copy a `{ company, role, period, … }` block to the **top** of `experience.items`; set `current: true` on it and remove it from the old one |
| Add a moment to the origin story | add `{ year, when, title, text, url }` at the **top** of `lore.items` (newest first); same-year cards group together automatically. Two links? use `links: [{ label, url }, …]` |
| Choose the colour | `accent: "daily"` (orange and blue swap every 24 h), `"orange"` or `"blue"`. Visitors can override it in the footer: flip the coin or pick a side |
| Link words inside a job bullet | write `[the words](https://…)` in the bullet text |
| Add a project | add `{ name, topic, kind, text, url }` to `projects.items`. `topic` is `"web2"`, `"web3"` or `"ai"` and drives the All / Web2 / Web3 / AI & ML filter (articles and toolkit groups use the same field) |
| Add an article | add `{ title, kicker, date, read, url, image, stats }` to `articles.items` — the **first** item is the magazine's cover story. Stats (claps, reactions) are typed in by hand |
| Rename a menu link / reorder the menu | set `nav: "…"` on a section; the menu always follows the order of the `<section>` tags in `index.html` |
| Add a YouTube video to Simar's TV | add `{ id, title, duration }` to a channel in `videos.channels` (id = the part after `?v=`) |
| Show a video in the highlight collage | add `featured: true` to it (the collage looks best with 7 featured) |
| Add a new TV channel / playlist | copy a `{ name, blurb, playlist, items }` block into `videos.channels` |
| Add / pin an X post | add `{ url }` to `posts.items` (Share → Copy link on X); add `pinned: true` for the PINNED sticker. Videos in posts play on the page |
| Update numbers | edit `stats` |
| Hide a section | set `show: false` on it (its nav link disappears too) |
| Swap a résumé | replace the PDF in `assets/docs/` (keep the file name), or edit `hero.secondaryCta.options` to change the download menu |
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

## ✨ Features
- Neo-brutalist layout (grid paper, thick borders, hard shadows) with editorial serif accents and hand-drawn underlines
- "Simar's TV": a retro TV player with channels (playlists), a TV guide, prev/next/CH+ keys and a highlight-reel collage. Videos play inside the page via privacy-friendly youtube-nocookie embeds
- Light/dark mode (follows system, remembers the visitor's toggle)
- Fully responsive, reduced-motion friendly, keyboard accessible
- Scroll reveals, marquee, sticker details — all CSS/vanilla JS, ~20 KB total code
