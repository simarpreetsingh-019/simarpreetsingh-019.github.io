/* =====================================================================
   ✏️  CONTENT FILE — the ONLY file you need to edit to change the website.
   =====================================================================

   HOW TO EDIT
   • Open this file (on github.com: click it → pencil icon ✏️), change the
     text between the "quotes", then "Commit changes". Vercel / GitHub Pages
     redeploys in about a minute.
   • Keep every quote " and comma , in place. If the page goes blank after
     an edit, a missing comma or quote is almost always the reason.
   • To use a double quote inside text, write \" or switch to ’ (curly quote).

   FIND A SECTION FAST — search this file (Ctrl/Cmd + F) for the marker:
     ✏️ EDIT: THEME         accent colour: "daily", "orange" or "blue"
     ✏️ EDIT: BASICS        page title, name, email, photo, résumé
     ✏️ EDIT: HERO          status bar, big headline, intro, stickers
     ✏️ EDIT: STATS         the six big numbers under the hero
     ✏️ EDIT: MARQUEE       the scrolling black strip
     ✏️ EDIT: ABOUT         "Who am I" text + photo
     ✏️ EDIT: PLAYBOOK      "What I bring to any dev team" cards + badges
     ✏️ EDIT: WORK          jobs / roles
     ✏️ EDIT: LORE          the year-by-year origin story (newest first)
     ✏️ EDIT: PROJECTS      project cards
     ✏️ EDIT: ARTICLES      the magazine (first item = cover story)
     ✏️ EDIT: VIDEOS        Simar's TV channels + highlight reel
     ✏️ EDIT: X POSTS       posts from X / Twitter
     ✏️ EDIT: TOOLKIT       skills
     ✏️ EDIT: CONTACT       contact text + Formspree form
     ✏️ EDIT: SOCIALS       social links (contact section + footer)

   HANDY TRICKS
   • Hide a whole section: set  show: false  in it (its menu link disappears).
   • *word*  → blue hand-drawn underline.   ~word~ → orange highlight block.
   • Images: drop the file into /assets/img and write "assets/img/name.jpg",
     or paste a full image URL (https://…).
   ===================================================================== */

window.SITE = {

  /* ✏️ EDIT: THEME -----------------------------------------------------
     "daily"  → alternates orange and blue every 24 hours (local midnight)
     "orange" or "blue" → always that colour
     Visitors can also flip the coin (or pick a side) in the footer;
     their pick is remembered on their device.                          */
  accent: "daily",

  /* Filter chips shown on Projects, Articles and Toolkit */
  filters: [
    { id: "all", label: "All" },
    { id: "web2", label: "Web2" },
    { id: "web3", label: "Web3" },
    { id: "ai", label: "AI & ML" },
  ],

  /* ✏️ EDIT: BASICS ----------------------------------------------------
     title/description = what Google and link previews show.            */
  meta: {
    // Shown in Google results, link previews and AI answers. Keep the title under ~65 characters.
    title: "Simarpreet Singh — Developer Advocate & DevRel Lead (Web2 & Web3)",
    description:
      "Simarpreet Singh is a developer advocate, developer relations lead, community builder and technical educator from New Delhi, India. 12K+ developers engaged, 1,000+ builders mentored, 150+ workshops. Partnerships, GTM and ecosystem growth across Web2, AI and Web3.",
    // ⚠️ Set this to your real live address after you deploy (no trailing slash).
    url: "https://simarpreetsingh-019.github.io",
    ogImage: "assets/img/portrait.jpg",
    // Roles you want to be found for (used in structured data for Google and AI search).
    roles: [
      "Developer Advocate", "Developer Relations (DevRel) Lead", "Developer Evangelist", "Community Builder",
      "Technical Educator", "Partnerships & Ecosystem Lead", "Go-To-Market (GTM) Lead",
    ],
    keywords: [
      "developer advocate", "developer relations", "DevRel", "developer evangelist", "community builder",
      "technical educator", "developer experience", "ecosystem lead", "partnerships", "GTM", "hackathons",
      "workshops", "Web3", "Web2", "AI", "Tezos", "Etherlink", "Sui", "India", "New Delhi" , "Web3 Punjab",, "Web3Panjab", "Punjab", 
    ],
  },


  person: {
    firstName: "Simarpreet",
    lastName: "Singh",
    email: "simarpreetsingh.019@gmail.com",
    location: "New Delhi, India",
    photo: "assets/img/portrait.jpg",
    photoAlt: "Simarpreet Singh giving a thumbs up by a stream",
    resume: "assets/docs/Simarpreet-Singh-Resume.pdf",
  },

  /* ✏️ EDIT: HERO ------------------------------------------------------
     status   = the black bar above the headline.
     headline = one string per line of the giant title.                  */
  status: "DEVELOPER ADVOCATE • COMMUNITY BUILDER • TECHNICAL EDUCATOR",

  hero: {
    // Each string is one line of the giant headline.
    headline: ["I turn", "*curious*", "developers", "into", "~builders~."],
    intro:
      "I love the moment a developer goes from “what is this?” to “I just shipped it.” I sit between the teams who build developer tools and the developers who use them, turning complex products into workshops, demos and docs, and developer feedback into product fixes.",
    stickers: ["Founder, Web3Panjab", "Ex–Lead DevRel, Tezos India", "Speaker & Mentor"],
    primaryCta: { label: "Let's talk", href: "#contact" },
    secondaryCta: {
      label: "Download resume",
      // Two versions: the button opens a small menu. Add or remove lines to change it.
      options: [
        { label: "Developer evangelist résumé", href: "assets/docs/Simarpreet-Singh-Developer-Evangelist-Resume.pdf" },
        { label: "Web3 DevRel résumé", href: "assets/docs/Simarpreet-Singh-Resume.pdf" },
      ],
    },
  },

  /* ✏️ EDIT: STATS -----------------------------------------------------
     Keep it to 6 items so the row stays even.                          */
  stats: [
    { value: "12K+", label: "developers engaged" },
    { value: "1,000+", label: "builders mentored" },
    { value: "150+", label: "workshops & university sessions" },
    { value: "60+", label: "hackathons partnered" },
    { value: "15+", label: "college blockchain clubs set up" },
    { value: "10+", label: "hackathons judged" },
  ],

  /* ✏️ EDIT: MARQUEE — words that scroll across the black strip. */
  marquee: [
    "Developer Relations", "Developer Experience", "Workshops", "Docs & Starter Kits", "Python", "React",
    "Open Source", "AI & ML", "Hackathons", "Community", "Solidity", "Tezos", "Sui",
  ],

  /* ✏️ EDIT: ABOUT -----------------------------------------------------
     paragraphs: one string per paragraph.
     photo: a local file ("assets/img/…") or a full image URL.
     photoLink: optional — clicking the photo opens this link.          */
  about: {
    show: true,
    nav: "About", // menu label (the menu follows the order of sections on the page)
    label: "[ WHO AM I ]",
    title: "Part engineer, part *community* builder.",
    paragraphs: [
      "I'm Simarpreet, Partnership & Ecosystem Lead at SOULVERSE, building the trust layer that connects identity, credentials, compliance and payments.",
      "Before that, I spent 2.6 years leading Developer Relations at Tezos India and evangelising Etherlink, an EVM rollup on Tezos. I ran workshops across India and Southeast Asia, scaled the TezAsia hackathon from 1,500 to 13,000+ participants, and co-created a credit-based blockchain course with the University of the Philippines.",
      "Alongside that, I run Web3Panjab, a grassroots community onboarding North India to Web3, and a YouTube series on building with Sui from a Solidity developer's perspective. I hold a B.Tech in Computer Science and Engineering from GTBIT, Guru Gobind Singh Indraprastha University (2018–2022).",
    ],
    photo: "https://pbs.twimg.com/media/HS6uh2aaEAA7T54.jpg?name=medium",
    photoFallback: "assets/img/night.jpg", // used if the photo above can't load
    photoAlt: "Simarpreet in a Solana High yearbook photo: most likely to host an event and find the photos later",
    photoLink: "https://x.com/simarpreet_019/status/2102809979434770561",
    photoCaption: "Solana High yearbook, class of 2026",
  },

  /* ✏️ EDIT: PLAYBOOK --------------------------------------------------
     "The DevRel playbook": what you bring to any developer team, each with
     one real number. Keep 6 cards so the grid stays even.
     alsoAt = the "Also at home in…" badges under the cards.            */
  playbook: {
    show: true,
    nav: "Playbook",
    label: "[ THE DEVREL PLAYBOOK ]",
    title: "What I bring to *any* dev team.",
    text: "Stack-agnostic skills, proven on real developer programs. The tools change; the job of getting developers from first contact to shipped does not.",
    cards: [
      { skill: "Developer onboarding", value: "−40%", unit: "onboarding questions", text: "Starter kits, CLI walkthroughs and explainer videos cut repeat onboarding questions on Discord by 40%." },
      { skill: "Technical education", value: "150+", unit: "workshops & sessions", text: "Mentored 1,000+ builders through structured workshops and live POC demos, and co-created a credit-backed course for 72 students at the University of the Philippines." },
      { skill: "Developer programs", value: "75%", unit: "graduation rate", text: "Designed a two-cohort builder camp; 60+ developers stayed on as long-term contributors." },
      { skill: "Product feedback loop", value: "+24%", unit: "wallet activation", text: "Worked with wallet, explorer and protocol teams to turn developer feedback into SDK fixes, including a 24% activation lift for Naan Wallet." },
      { skill: "Events & hackathons", value: "1.5K → 13K+", unit: "hackathon participants", text: "Scaled a flagship hackathon nearly 9×, and ran 40+ in-person community events across India on a single day." },
      { skill: "Content & storytelling", value: "35+", unit: "articles & videos", text: "Tutorials, talks and explainers on Medium, dev.to and YouTube, written for beginners and experienced developers alike." },
    ],
    alsoAt: [
      { title: "Google developer communities", text: "GDG DevFest New Delhi speaker · Outreach head, Google Developer Student Club (GTBIT)" },
      { title: "Open source", text: "Linux Foundation travel scholarship to Open Source Summit · GirlScript Winter of Code · Top-25 at Contributor's Hack" },
      { title: "AI & computer vision", text: "OpenCV projects and articles · Seq2Seq translator · co-hosted AI After Hours with Hyperbolic" },
      { title: "Frontend & APIs", text: "React and Next.js prototypes · OverWatch TS template · SDK and wallet integrations" },
      { title: "AI-assisted building", text: "Shipped two production frontends for paying clients with v0, Cursor and Claude" },
      { title: "Research", text: "Secure data transmission with reversible data hiding and steganography at DRDO" },
    ],
  },

  /* ✏️ EDIT: WORK ------------------------------------------------------
     Newest role first. To add a role, copy one { … } block (from
     "company" to the closing "},") and paste it where it belongs.
       current: true  → black "NOW" card (use on one role only)
       url            → optional link on the company name
       points         → bullet list;  tags → small labels
       Links inside a bullet: wrap words like [this](https://…) and they
       become highlighted, clickable links.                           */
  experience: {
    show: true,
    nav: "Work", // menu label (the menu follows the order of sections on the page)
    label: "[ THE WORK ]",
    title: "Where I've *shipped*.",
    items: [
      {
        company: "SOULVERSE",
        url: "https://soulverse.us",
        role: "Partnership & Ecosystem Lead",
        period: "Jul 2026 — Present",
        location: "Remote · New Delhi",
        current: true,
        points: [
          "Leading partnerships and ecosystem growth for trust infrastructure spanning identity, credentials, validation and settlement.",
          "Working across RWA, digital assets and tokenization to bring programmable trust into fintech and Web3 products.",
        ],
        tags: ["GTM", "Partnerships", "Digital Identity", "RWA"],
      },
      {
        company: "PizzaDAO",
        url: "https://x.com/Pizza_DAO",
        role: "India Lead - Underboss",
        period: "2025 — Present",
        location: "PAN India",
        points: [
          "Spent two months planning India's edition of the Global Bitcoin Pizza Party with the PizzaDAO team.",
          "Managed and hosted 40+ in-person events across India for Bitcoin Pizza Day, all running at the same time on the same day.",
          "Co-hosted EVVM & PizzaDAO's community party during ETHGlobal New Delhi and helped execute its Delhi event.",
        ],
        tags: ["Community", "IRL Events", "Operations", "Web3"],
      },
      {
        company: "Tezos India",
        url: "https://in.linkedin.com/company/tezos-india-foundation",
        role: "Lead Developer Relations",
        period: "Oct 2022 — Mar 2025",
        location: "Remote / Hybrid",
        points: [
          "Owned developer relations for Tezos L1 and was then entrusted to lead developer advocacy for Etherlink (EVM L2) in India, expanding into onboarding, ecosystem programs and technical enablement.",
          "Grew ecosystem developer activity 4×, from 3,000 to 12,000+ engaged developers, through workshops, developer clubs and onboarding series.",
          "Launched and scaled the [TezAsia Hackathon](https://unstop.com/competitions/tezasia-hackathon-30-tezos-india-695650) from 1,500 to 13,000+ participants, with 1,050+ submissions and 200+ projects reaching MVP.",
          "Led 150+ workshops and university programs across India and Southeast Asia, mentoring 1,000+ builders and driving a 26% increase in first-time smart-contract deployers. Many sessions are [recorded in this playlist](https://www.youtube.com/playlist?list=PLNO985wwQsV5BMBRIO4ZHddWqkjQfSqxG).",
          "Ran flagship enablement programs (TezConnect, TezDay and [Tezos BuilderCamp](https://code8tezos-ruby.vercel.app/), 2 cohorts with a 75% graduation rate) with certification-style learning tracks, architecture reviews and live POC demos for startups, universities and 80+ hackathon partners; helped introduce the [Tezos Guilds model](https://medium.com/tezos-india-foundation/tezos-india-guild-fostering-collaboration-and-innovation-80ab37792598) with 20+ community leads.",
          "Built production-grade dApps and reusable React templates for SDK demos (React, Ethers.js, Solidity, SmartPy), showing EVM compatibility, wallet authentication and contract-interaction patterns.",
          "Worked with wallet, explorer and protocol teams to improve SDK usability, including a 24% activation lift for Naan Wallet; open-source [starter kits](https://github.com/simarpreetsingh-019/TIProjects) and public content increased new project creation by 15%.",
          "Co-created a credit-based blockchain curriculum with the University of the Philippines.",
        ],
        tags: ["DevRel", "SmartPy", "Hackathons", "Education"],
      },
      {
        company: "Etherlink — L2 on Tezos",
        url: "https://etherlink.com",
        role: "Developer Advocate",
        period: "Jan 2024 — Apr 2025",
        location: "Remote",
        points: [
          "Created Solidity-to-Etherlink transition content, including starter kits, CLI onboarding videos and gas-comparison explainers, cutting Discord onboarding queries by 40%.",
          "Ran 30+ EVM workshops and supported 100+ hackathon submissions; 18 teams continued building with mentorship and grants.",
          "Launched the [Etherlink Project Showcase on GitHub](https://github.com/simarpreetsingh-019/TIProjects) to spotlight dApps built after hackathons and inspire new builders.",
        ],
        tags: ["EVM", "Solidity", "Docs", "Workshops"],
      },
      {
        company: "Web3Panjab",
        url: "https://x.com/web3panjab",
        role: "Founder & Independent Consultant",
        period: "Jul 2022 — Present",
        location: "Delhi · Chandigarh · Remote",
        points: [
          "Leading grassroots blockchain education in underrepresented regions of North India through local meetups, onboarding sessions and contributor teams.",
          "Since April 2025, shipped two production frontends for paying clients, [SuiSips](https://suisips.com) and [YinYang (v1)](http://app.yinyang.bet), using AI-assisted development workflows (v0, Cursor, Claude), while hosting developer events for Web3 companies.",
          "Generated $9K in revenue at a 44% margin across consulting and events in 8 months.",
          "Lead host and program manager for a 40+ event PAN-India developer networking series in May 2026, with a $20K+ budget.",
          "Built an independent, developer-focused YouTube series testing new tools on Sui through [hands-on tutorials](https://youtu.be/u3LAXnwkj4A).",
          "Co-hosted events such as AI After Hours with Hyperbolic, and advised 7+ companies on PAN-India tours and incubation onboarding.",
        ],
        tags: ["Community", "Consulting", "Frontend", "Events"],
      },
      {
        company: "DRDO — Scientific Analysis Group",
        role: "Research Trainee",
        period: "Feb 2022 — Jul 2022",
        location: "New Delhi",
        points: [
          "Researched secure data transmission using Reversible Data Hiding (RDH) and steganography.",
        ],
        tags: ["Research", "Security", "Python"],
      },
    ],
  },

  /* ✏️ EDIT: LORE ------------------------------------------------------
     NEWEST FIRST: add new moments at the TOP of the list.
     Cards with the same "year" are grouped under that year automatically.
       when      → optional month/date badge, e.g. "Sep"
       url       → optional link; makes the card clickable
       linkLabel → optional text for that link (default "View ↗")
       links     → optional, for more than one link:
                   links: [{ label: "Announcement ↗", url: "…" }, { label: "Watch ↗", url: "…" }]
     Example:
       { year: "2027", when: "Jan", title: "Something new", text: "One or two sentences.", url: "https://…" },   */
  lore: {
    show: true,
    nav: "Lore", // menu label (the menu follows the order of sections on the page)
    label: "[ ORIGIN STORY ]",
    title: "lore",
    items: [
      { year: "2026", when: "May", title: "Bitcoin Pizza Day across India", text: "After two months of planning with PizzaDAO, hosted 40+ in-person Bitcoin Pizza Day events across India, all on the same day.", url: "https://x.com/simarpreet_019/status/2058184415742935451", linkLabel: "See the post ↗" },
      { year: "2026", title: "Content creation era", text: "Made creating content a consistent habit." },

      { year: "2025", when: "Oct", title: "PizzaDAO in Delhi", text: "Helped PizzaDAO execute its Delhi community event.", url: "https://x.com/ariutokintumi/status/1979597118626242655", linkLabel: "See the post ↗" },
      { year: "2025", when: "Sep", title: "First ETHGlobal: New Delhi", text: "Attended my first ETHGlobal event in New Delhi and co-hosted a community party with the EVVM team. It was a huge success.", url: "https://x.com/simarpreet_019/status/1972374851685142850", linkLabel: "See the post ↗" },
      { year: "2025", title: "Shipping for clients", text: "Shipped two production frontends for paying clients, including SuiSips, using AI-assisted workflows with v0, Cursor and Claude.", url: "https://suisips.com", linkLabel: "Visit SuiSips ↗" },
      { year: "2025", when: "Apr", title: "Back to Web3Panjab", text: "Stepped away from Tezos India to focus on Web3Panjab, making it sustainable through paid events and freelance work." },

      { year: "2024", when: "Nov", title: "Speaker at GDG DevFest New Delhi", text: "Once an attendee, then a community partner, now a speaker: at GDG New Delhi's DevFest I showed how to deploy EVM-compatible code on Tezos using Etherlink.", url: "https://x.com/simarpreet_019/status/1854956350486257850", linkLabel: "See the post ↗" },
      { year: "2024", when: "Aug", title: "WebX Asia, Tokyo", text: "Attended WebX 2024 in Tokyo, one of Asia's largest Web3 conferences.", url: "https://x.com/simarpreet_019/status/1828700897024897172", linkLabel: "See the post ↗" },
      { year: "2024", when: "Aug", title: "ETHTokyo", text: "Made it to ETHTokyo and joined the builder community in Japan.", url: "https://x.com/simarpreet_019/status/1827217062437253223", linkLabel: "See the post ↗" },
      { year: "2024", when: "Aug", title: "First solo international trip: Japan", text: "Travelled to Japan on my own for the first time, a trip built around ETHTokyo and WebX." },
      { year: "2024", when: "May", title: "Bitcoin Pizza Day with PizzaDAO", text: "Hosted a Bitcoin Pizza Day party with PizzaDAO, supported by Flipster, Intract and Bitget India.", url: "https://x.com/simarpreet_019/status/1793555337855033815", linkLabel: "See the post ↗" },
      { year: "2024", when: "Apr", title: "Workshop & panel at Chandigarh University", text: "Ran a hands-on workshop and a panel discussion on blockchain and dApps with the Tezos DevRel team and Antier.", url: "https://x.com/antier_official/status/1783074497949556908", linkLabel: "See the post ↗" },
      { year: "2024", when: "Jan", title: "SmartPy workshops, online", text: "Ran interactive online sessions on building on Tezos with SmartPy.", url: "https://x.com/simarpreet_019/status/1752327325562310663", linkLabel: "See the post ↗" },
      { year: "2024", when: "Jan", title: "SmartPy workshop at IGDTUW, Delhi", text: "My first offline session of 2024: developing on Tezos with SmartPy, hosted with the IGDTUW team.", url: "https://x.com/simarpreet_019/status/1750960275715727625", linkLabel: "See the post ↗" },
      { year: "2024", when: "Jan", title: "Developer advocate for Etherlink", text: "Took on developer advocacy for Etherlink, the EVM Layer 2 on Tezos, alongside my Tezos India role." },

      { year: "2023", when: "Dec", title: "ETHIndia 2023", text: "Back at ETHIndia in Bengaluru for its 2023 edition.", url: "https://x.com/simarpreet_019/status/1733730763353596411", linkLabel: "See the post ↗" },
      { year: "2023", when: "Dec", title: "TezDay in Bengaluru", text: "Hosted a Tezos India TezDay meetup in Whitefield, Bengaluru, during ETHIndia week.", url: "https://x.com/simarpreet_019/status/1730205934688080189", linkLabel: "See the post ↗" },
      { year: "2023", when: "Sep", title: "Blockchain orientation at MSIT", text: "Led an in-person orientation session on blockchain for students at Maharaja Surajmal Institute of Technology, New Delhi.", url: "https://x.com/simarpreet_019/status/1702368211415810182", linkLabel: "See the post ↗" },
      { year: "2023", title: "Speaker at Web3Conf India", text: "Spoke at the second edition of Web3Conf India on Metaverse-as-a-Service and how it works with blockchain.",
        links: [{ label: "Announcement ↗", url: "https://x.com/simarpreet_019/status/1683549900431323137" }, { label: "Watch the talk ↗", url: "https://www.youtube.com/watch?v=7aixfHAJ0vA" }] },
      { year: "2023", title: "Full-time DevRel Lead", text: "Moved into a full-time role as Developer Relations Lead at Tezos India." },

      { year: "2022", when: "Dec", title: "First Web3 conference: ETHIndia", text: "Attended my first Web3 conference, which was also my first trip for one. I learned a lot." },
      { year: "2022", when: "Oct", title: "Joined Tezos India", text: "Joined Tezos India as a Developer Relations intern, focused on onboarding developers to the Tezos blockchain in India." },
      { year: "2022", when: "1 Oct", title: "First offline Web3Panjab session", text: "Organised two meetups in Chandigarh on the same day and gave my first in-person talk: an introduction to Web3 and blockchain.", url: "https://x.com/simarpreet_019/status/1577737002975645696", linkLabel: "See the post ↗" },
      { year: "2022", when: "Sep", title: "A month of firsts", text: "Attended the Solana Hacker House in New Delhi, received a Linux Foundation travel scholarship to Open Source Summit in Dublin, and became the CoinDCX local chapter lead for Chandigarh.", url: "https://x.com/simarpreet_019/status/1572150109206638592", linkLabel: "See the post ↗" },
      { year: "2022", when: "16 Jul", title: "The Web3Panjab journey begins", text: "Launched Web3Panjab in Chandigarh to promote Web3 and open source and to onboard new people across Punjab and North India. It has hosted many events since." },
      { year: "2022", title: "The Web3 leap", text: "Began the year as a research trainee at DRDO, then founded Web3Panjab and joined Tezos India in Developer Relations. I never looked back." },

      { year: "2021", title: "Technical writing & GirlScript Winter of Code", text: "Worked as a technical content writer at The SidePath and contributed to GirlScript Winter of Code." },
      { year: "2020", title: "Open-source season", text: "Top 25 contributor at Contributor's Hack (Student Code-In), working on YouthIcon ML datasets for Asian languages. Also a student trainee at Quantel." },
      { year: "2020", title: "DSC GTBIT & CPPIndia", text: "Outreach and logistics head at DSC GTBIT, competitive programming mentor, and session moderator for CPPIndia." },
      { year: "2019", title: "NASA Space Apps", text: "Won 1st prize at the NASA Space Apps Challenge prequalifier and finished in the Top 10 at the India North-region qualifiers." },
      { year: "2019", title: "First hackathon win", text: "Won 3rd prize at HackGTBIT and was a Top-5 Campus Ambassador for ESYA '19 at IIIT Delhi. The hackathon bug bit hard." },
    ],
  },

  /* ✏️ EDIT: PROJECTS --------------------------------------------------
     One line per project: { name, topic, kind (small label), text, url }.
     topic: "web2", "web3" or "ai" — used by the All / Web2 / Web3 / AI & ML filter.
     Put your best project first.                                       */
  projects: {
    show: true,
    nav: "Projects", // menu label (the menu follows the order of sections on the page)
    label: "[ SIDE QUESTS ]",
    title: "Things I've *built*.",
    items: [
      { name: "SuiSips", topic: "web3", kind: "Next.js · Client build", text: "A production SIP tracker and community platform for the Sui ecosystem: proposals synced from GitHub, discussions, articles, videos and a curated tweet wall. Built with Next.js, React Markdown and Tailwind CSS.", url: "https://suisips.com" },
      { name: "Miden SDK Simulator", topic: "web3", kind: "React · Miden SDK", text: "An interactive demo of anonymous, privacy-preserving voting on Miden's ZK rollup SDK. Scoped, built and shipped with no prior Miden experience, to show how any new SDK becomes learnable through a working demo.", url: "https://sim-miden-demo-main.vercel.app/" },
      { name: "Etherlink Project Showcase", topic: "web3", kind: "Etherlink · GitHub", text: "A showcase repo spotlighting dApps built on Tezos and Etherlink after hackathons, alongside demo apps for workshop attendees.", url: "https://github.com/simarpreetsingh-019/TIProjects" },
      { name: "Gitfund", topic: "web3", kind: "Web3 · OSS", text: "Auto-pays open-source contributors for merged PRs using programmable smart-contract logic.", url: "https://github.com/simarpreetsingh-019/TIProjects/tree/main/Gitfund" },
      { name: "JSON API Visualizer", topic: "web2", kind: "Next.js · Live tool", text: "Fetch any public REST API and explore the response as an interactive graph and tree. Built with Next.js, Tailwind CSS and v0.", url: "https://json-visual.vercel.app" },
      { name: "OverWatch TS", topic: "web2", kind: "Open source", text: "Built the initial example template for overwatch-ts, a lightweight state-management library for Next.js.", url: "https://github.com/simarpreetsingh-019/overwatch/tree/main" },
      { name: "Virtual Tweet Gallery", topic: "web2", kind: "Community tool", text: "The W3EventGallery bot collects event tweets into a shared gallery of memories.", url: "https://web3panjab.github.io/SolanaHHDilli/" },
      { name: "German → English Translator", topic: "ai", kind: "ML", text: "A Seq2Seq-with-attention tutorial implementation for German-to-English translation.", url: "https://github.com/soumyajit4419/YouthIcon" },
      { name: "Face Detection & Recognition", topic: "ai", kind: "OpenCV", text: "Haar-cascade face and eye detection that can also save and recognise faces by name.", url: "https://github.com/simarpreetsingh-019/face-recognition--girlscript-jaipur-project-" },
    ],
    moreLink: { label: "More on GitHub", href: "https://github.com/simarpreetsingh-019" },
  },

  /* ✏️ EDIT: ARTICLES --------------------------------------------------
     The FIRST item is the big cover story; the next two sit beside it;
     the rest become taped-on cards.
       title, kicker (small red label), date, read ("4 min"), url  → required
       topic → "web2", "web3", "ai" or "other" (for the filter chips)
       image → the post's cover (on Medium: right-click the image → Copy image address)
       dek   → optional one-line summary
       stats → optional, typed by hand: [{ value: "120", label: "claps" }]
       also  → optional second link, e.g. the same post on dev.to
     Example:
       { title: "My new post", kicker: "Web3", date: "Oct 2026", read: "5 min",
         url: "https://medium.com/…", image: "https://miro.medium.com/…", stats: [{ value: "40", label: "claps" }] },   */
  articles: {
    show: true,
    nav: "Articles",
    label: "[ THE DISPATCH ]",
    title: "Articles, *in print*.",
    masthead: "THE SIMAR DISPATCH",
    items: [
      {
        title: "Detecting Geometrical Shapes in an Image using OpenCV", topic: "ai",
        dek: "Contours, polygon approximation and a vertex count: how a few lines of OpenCV tell a triangle from a hexagon.",
        kicker: "Computer Vision",
        date: "May 2020",
        read: "3.8 min",
        url: "https://medium.com/simply-dev/detecting-geometrical-shapes-in-an-image-using-opencv-bad67c40174f",
        image: "https://miro.medium.com/v2/resize:fit:604/1*DF7tlYcFvoRqpTARqVqn4g.jpeg",
        stats: [{ value: "179", label: "claps on Medium" }, { value: "12", label: "reactions on dev.to" }],
        also: { label: "Also on dev.to", url: "https://dev.to/simarpreetsingh019/detecting-geometrical-shapes-in-an-image-using-opencv-4g72" },
        pub: "Simply Dev",
      },
      {
        title: "Paying ATTN Might Just Be the Next Alpha: The Rise of AttentionCoins", topic: "web3",
        dek: "Attention is the most valuable on-chain asset. What if you could mine a token simply by paying attention?",
        kicker: "Web3", date: "May 2025", read: "3.1 min",
        url: "https://medium.com/@simarpreetsingh.019/paying-attn-might-just-be-the-next-alpha-the-rise-of-attentioncoins-attention-is-all-you-13b6c2bbb5f0",
        image: "https://miro.medium.com/v2/resize:fit:542/1*OJdcmegcUFLdUijWrIk_AA.png",
        stats: [{ value: "3", label: "claps" }],
      },
      {
        title: "What is Canny Edge Detection?", topic: "ai",
        dek: "The five-step algorithm behind crisp edges, explained with code.",
        kicker: "Computer Vision", date: "Apr 2020", read: "6.1 min",
        url: "https://medium.com/simply-dev/what-is-canny-edge-detection-cfefa272a8d0",
        image: "https://miro.medium.com/v2/resize:fit:987/0*eZT8V5qNeSiXiXBn.png",
        stats: [{ value: "138", label: "claps" }], pub: "Simply Dev",
      },
      {
        title: "Why Arbitrum Stands Out: A Developer's Perspective on Ethereum Scaling", topic: "web3",
        kicker: "Layer 2", date: "Feb 2025", read: "3.2 min",
        url: "https://medium.com/@simarpreetsingh.019/why-arbitrum-stands-out-a-developers-perspective-on-ethereum-scaling-f9121124d073",
        image: "https://miro.medium.com/v2/resize:fit:1046/1*xSuW3FNhGvufKI680Njg5Q.png",
      },
      {
        title: "Getting Started with Python", topic: "web2",
        kicker: "Python", date: "Feb 2022", read: "5.4 min",
        url: "https://medium.com/simply-dev/getting-started-with-python-c22347a78403",
        image: "https://miro.medium.com/v2/da:true/resize:fit:1200/0*jQw8UDcNVCunORTG",
        stats: [{ value: "95", label: "claps" }], pub: "Simply Dev",
      },
      {
        title: "A New Chapter in Blockchain: The Story of Berachain", topic: "web3",
        kicker: "Web3", date: "Feb 2025", read: "4.4 min",
        url: "https://medium.com/@simarpreetsingh.019/a-new-chapter-in-blockchain-the-story-of-berachain-76768d21e40b",
        image: "https://miro.medium.com/v2/resize:fit:1200/1*3hHMmnOPYUr2RBlNejGTmQ.png",
      },
      {
        title: "Learning JavaScript & Sharing What I Know, Part 1", topic: "web2",
        kicker: "JavaScript", date: "Mar 2025", read: "4.1 min",
        url: "https://medium.com/simply-dev/learning-javascript-sharing-what-i-know-about-it-lets-see-where-it-goes-part-1-2254c369d56a",
        image: "https://miro.medium.com/v2/resize:fit:1086/1*ovy8r3c52zubSDgsblujTQ.png", pub: "Simply Dev",
      },
      {
        title: "How Eco Revamps Stablecoin Transactions", topic: "web3",
        kicker: "Stablecoins", date: "Jan 2025", read: "3.4 min",
        url: "https://medium.com/@simarpreetsingh.019/the-revolution-of-onchain-interactions-how-eco-revamps-stablecoin-transactions-9961b73b50ba",
        image: "https://miro.medium.com/v2/da:true/bc1f8416df0cad099e43cda2872716e5864f18a73bda2a7547ea082aca9b5632",
      },
      {
        title: "OnePlus 7T: My Best Companion", topic: "other",
        kicker: "Off-topic", date: "Apr 2020", read: "8.5 min",
        url: "https://medium.com/@simarpreetsingh.019/oneplus-7t-my-best-companion-660f75229f44",
        image: "https://miro.medium.com/v2/resize:fit:800/0*GWgnAhkfeAEZMKXU.png",
        stats: [{ value: "231", label: "claps" }],
      },
    ],
    moreLink: { label: "All posts on Medium", href: "https://medium.com/@simarpreetsingh.019" },
  },

  /* ✏️ EDIT: VIDEOS (Simar's TV) ----------------------------------------
     Videos play inside the page. To add one, copy a line inside a channel's
     items and change:
       id       → the part after ?v= in the YouTube link
       title, duration ("12:34")
       by       → the channel that hosted it (leave out for your own uploads)
       featured → true shows it in the "Mic check" collage (7 looks best)
     To add a whole channel, copy a { name, blurb, playlist, items } block.  */
  videos: {
    show: true,
    nav: "Videos", // menu label (the menu follows the order of sections on the page)
    label: "[ NOW PLAYING ]",
    title: "Tune in to *Simar's TV*.",
    text: "Workshops, explainers and stage talks from the last few years. Pick a channel, press play and watch it right here on the page.",
    cta: { label: "YouTube channel", href: "https://youtube.com/@simarpreet019" },
    channels: [
       {
        name: "Dapp Breakdown",
        blurb: "Short explainers on protocols worth knowing.",
        playlist: "https://www.youtube.com/playlist?list=PLNO985wwQsV7dz8UVeNQmBzpI1tM-PTuv",
        items: [
          { id: "3FK9SONxOzA", title: "Sui Starter Pack: getting started with Sui", duration: "5:00" },
          { id: "s79igTDkRZc", title: "Sui Starter Pack, extended: bridging ETH to Sui", duration: "10:44" },
          { id: "DgB53FE4Wo0", title: "What is Exa Protocol? Running an Exa node in 2 minutes", duration: "10:18" },
          { id: "J5QY4f2zlys", title: "What is Berafarm? Berafarm 101 on Berachain", duration: "3:43" },
          { id: "-s_ve3oFRr4", title: "What is IVX Fi on Berachain?", duration: "4:52" },
          { id: "iDYPuabLJh8", title: "StealthVote: anonymous voting with Miden SDK ZK proofs", duration: "2:12" },
        ],
      },

       {
        name: "On Stage",
        blurb: "Tezos & Etherlink workshops, hackathons and conference talks.",
        playlist: "https://www.youtube.com/playlist?list=PLNO985wwQsV5BMBRIO4ZHddWqkjQfSqxG",
        items: [
          { id: "7aixfHAJ0vA", title: "Unlocking Metaverse-as-a-Service (Web3Conf)", duration: "39:12", by: "Web3Conf India", featured: true },
          { id: "RiPHJDR5Ng0", title: "Get Started with Etherlink at Hack4Bengal 3.0", duration: "1:13:08", by: "Hack4Bengal", featured: true },
          { id: "Vob3wCOYqJI", title: "Etherlink Workshop with Tezos India", duration: "1:23:38", by: "Crash Talks", featured: true },
          { id: "5A0tR9XGCnw", title: "Intro to Etherlink at CodeWave Hub", duration: "55:57", by: "CodeWave Hub", featured: true },
          { id: "Rhox07X9-iw", title: "SmartPy and Tezos Workshop, Tezos Club SATI", duration: "1:09:20", by: "NextGen Code", featured: true },
          { id: "1vixLGDBWKk", title: "Etherlink: a step towards the future", duration: "1:16:22", by: "Tezos JH", featured: true },
          { id: "3kMPb0g-LS4", title: "TezAsia Hackathon 2023: Kickoff Event", duration: "48:12", by: "Tezos India", featured: true },
          { id: "fbqA2u741qU", title: "Tezos India Hackathon: SmartPy at Hansraj College, Part 1", duration: "49:07", by: "Web3 Entirety" },
          { id: "pznhBUJ3OI0", title: "Tezos India Hackathon: SmartPy at Hansraj College, Part 2", duration: "44:28", by: "Web3 Entirety" },
          { id: "N-adfu-rM14", title: "Web3 using Tezos webinar at DSU DevHack 2024", duration: "58:08", by: "DSU DevHack" },
          { id: "4fVvIuCaDFc", title: "Building a dapp on Tezos with LIGO, Part 1 (TezAsia 3.0)", duration: "57:06", by: "Tezos India" },
          { id: "BnA-UUXGr3Y", title: "Building a dapp on Tezos with LIGO, Part 2 (TezAsia 3.0)", duration: "1:19:11", by: "Tezos India" },
          { id: "-cWSrqpvXG8", title: "Smart contracts with SmartPy: new syntax (TezAsia 3.0)", duration: "1:21:23", by: "Tezos India" },
          { id: "Yn5Zlriu1oM", title: "Connecting dApp frontends with Taquito.js (TezAsia 3.0)", duration: "56:47", by: "Tezos India" },
          { id: "TFzPrBZyBZY", title: "Understanding Rollups on Tezos (TezAsia 3.0)", duration: "1:25:07", by: "Tezos India" },
          { id: "6SV8C_-KI2k", title: "Tezos deployment and management with Zeeve (TezAsia 3.0)", duration: "1:17:45", by: "Tezos India" },
          { id: "NenHLrSWgJQ", title: "Demo Day: TezAsia Hackathon 3.0", duration: "2:42:03", by: "Tezos India" },
        ],
      },
       
      {
        name: "Solidity → Move",
        blurb: "A Solidity dev learns Sui Move, out loud.",
        playlist: "https://www.youtube.com/playlist?list=PLNO985wwQsV5ZJfMe8NUg81aWo1Kkn5Rp",
        items: [
          { id: "6u9tOdSCmIs", title: "What is Move lang: from Solidity to Move, a dev's perspective", duration: "14:42" },
          { id: "u3LAXnwkj4A", title: "What is Sui Move?", duration: "31:06" },
          { id: "E190cj6JjZ0", title: "Sui SIP 6 explained: StakedSui", duration: "8:11" },
        ],
      },
      
    ],
    // The collage under the TV shows every video marked  featured: true
    reel: { label: "[ HIGHLIGHT REEL ]", title: "Mic check, *on stage*." },

  },

  /* ✏️ EDIT: X POSTS ---------------------------------------------------
     Add a post: copy a line and paste its link (on X: Share → Copy link).
     It appears as the real X post, so videos play on the page.
       pinned: true → yellow PINNED sticker (use on one post)
       by / byName  → only for posts from other accounts
       text, date, likes, video → optional backup text, shown while X loads
                                   or if a visitor's browser blocks X
     Minimal example:  { url: "https://x.com/simarpreet_019/status/123…" },   */
  posts: {
    show: true,
    nav: "On X", // menu label (the menu follows the order of sections on the page)
    label: "[ FROM THE TIMELINE ]",
    title: "Live from *X*.",
    text: "Threads, clips and moments from @simarpreet_019.",
    name: "Simarpreet Singh",
    handle: "@simarpreet_019",
    cta: { label: "Follow on X", href: "https://x.com/simarpreet_019" },
    items: [
      { url: "https://x.com/simarpreet_019/status/1909557714235117870", pinned: true, date: "Apr 8, 2025", video: "5 min", likes: 83,
        text: "Before uploading the third part of my video series on building with Sui from a Solidity dev's perspective, I made a starter pack for people to explore and join the Sui ecosystem." },
      { url: "https://x.com/simarpreet_019/status/1918458889328017793", date: "May 3, 2025", likes: 104,
        text: "Attention is the most valuable on-chain asset. Not liquidity. Not memes. Not clout. What if you could mine a token just by paying attention?" },
      { url: "https://x.com/simarpreet_019/status/1884876456725237785", date: "Jan 30, 2025", likes: 40,
        text: "Procrastinated a lot last year on one of my yearly goals: tech content creation. Finally solved it. I learned about Move, Sui and Aptos and shared it in this video." },
      { url: "https://x.com/simarpreet_019/status/1910738322592526746", date: "Apr 11, 2025", video: "7.6 min", likes: 16,
        text: "While bridging USDC from Polygon to Sui, I got stuck. Bridge successful, but couldn't claim. Why? Needed SUI for gas. That rabbit hole led me to…" },
      { url: "https://x.com/simarpreet_019/status/1922318679410135379", date: "May 13, 2025", likes: 14,
        text: "What is Bluefin? A decentralized exchange on Sui offering low-latency trading, perps, lending and staking. A thread." },
      { url: "https://x.com/simarpreet_019/status/1892127726523601009", date: "Feb 19, 2025", likes: 14,
        text: "New video: diving into Sui Move and breaking down Solidity code to see how things change when coding in Move. Episode 2 of the series." },
      { url: "https://x.com/simarpreet_019/status/2058184415742935451", date: "May 23, 2026", likes: 33,
        text: "Two months of planning with PizzaDAO, and it was so much fun hosting the Global Bitcoin Pizza Party across India this year." },
      { url: "https://x.com/simarpreet_019/status/1972374851685142850", date: "Sep 28, 2025", video: "6 s",
        text: "Hosted one of the best parties during ETHGlobal New Delhi, with friends from RollAMate, CoW Swap, Camp Network and PizzaDAO." },
      { url: "https://x.com/ariutokintumi/status/1979597118626242655", by: "@ariutokintumi", byName: "ariutokintumi", date: "Oct 18, 2025", video: "19 s",
        text: "PizzaDAO thanks @simarpreet_019 for helping execute its Delhi event." },
      { url: "https://x.com/simarpreet_019/status/1572150109206638592", date: "Sep 20, 2022", likes: 80,
        text: "An exciting month: Solana Hacker House New Delhi, a Linux Foundation travel scholarship to Open Source Summit Dublin, and becoming CoinDCX's local chapter lead in Chandigarh." },
    ],
  },

  /* ✏️ EDIT: TOOLKIT ---------------------------------------------------
     Four groups; add or remove words inside the [ … ] lists.
     topic decides which filter chip (All / Web2 / Web3 / AI & ML) highlights it. */
  skills: {
    show: true,
    nav: "Toolkit", // menu label (the menu follows the order of sections on the page)
    label: "[ TOOLKIT ]",
    title: "What's in the *bag*.",
    // topic: "all" groups never fade; "web2" / "ai" / "web3" groups light up with the filter chips.
    groups: [
      { name: "DevRel & Community", topic: "all", items: ["Developer Relations", "Developer onboarding", "Developer experience", "Workshops", "Hackathons", "Docs & starter kits", "Live training", "Certification design", "POC development", "Hackathon mentoring", "Technical writing", "Public speaking", "Partnerships", "GTM"] },
      { name: "Web2 & Frontend", topic: "web2", items: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "REST APIs", "Supabase", "Vercel", "Web scraping", "Git & GitHub", "C++", "Java"] },
      { name: "AI & ML", topic: "ai", items: ["Cursor", "Claude", "v0 (Vercel)", "LLM APIs", "AI agent frameworks (exploring)", "Python", "OpenCV", "Image processing", "Computer vision", "Seq2Seq & attention models"] },
      { name: "Web3", topic: "web3", items: ["Solidity", "SmartPy", "Move", "Ethers.js", "Hardhat", "Foundry", "Remix", "Thirdweb", "OpenZeppelin", "Taquito.js", "Beacon SDK", "Web3.js", "Tezos", "Etherlink", "Ethereum / EVM", "Sui", "Aptos", "Arbitrum", "Berachain", "Miden", "Sei", "Monad"] },
    ],
  },

  /* ✏️ EDIT: CONTACT — text above the form + the Formspree endpoint. */
  contact: {
    label: "[ SAY HELLO ]",
    title: "Got an *ecosystem* to grow?",
    text: "Partnerships, speaking, hackathon judging or just a good Web3 conversation: my inbox is open.",
    // Same Formspree form as the old site. Submissions go to your Formspree inbox/email.
    formspree: "https://formspree.io/f/mayakpra",
  },

  /* ✏️ EDIT: SOCIALS — shown in the contact section and the footer.
     { name: "Label", handle: "@you", url: "https://…" }               */
  socials: [
    { name: "X / Twitter", handle: "@simarpreet_019", url: "https://x.com/simarpreet_019" },
    { name: "LinkedIn", handle: "simarpreetsingh019", url: "https://linkedin.com/in/simarpreetsingh019" },
    { name: "GitHub", handle: "simarpreetsingh-019", url: "https://github.com/simarpreetsingh-019" },
    { name: "YouTube", handle: "@simarpreet019", url: "https://youtube.com/@simarpreet019" },
    { name: "Medium", handle: "@simarpreetsingh.019", url: "https://medium.com/@simarpreetsingh.019" },
    { name: "Telegram", handle: "@simarpreet_019", url: "https://t.me/simarpreet_019" },
    { name: "All links", handle: "bio.link", url: "https://bio.link/simarpreetsingh" },
  ],

  footer: {
    line: "Built with love, coffee & drama.",
  },
};
