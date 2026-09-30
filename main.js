/* Renders everything from content.js. You shouldn't need to edit this file. */
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // *word* → hand-drawn underline, ~word~ → orange highlight
  function rich(s) {
    return esc(s)
      .replace(/\*([^*]+)\*/g, '<span class="u">$1</span>')
      .replace(/~([^~]+)~/g, '<span class="hl">$1</span>');
  }
  // [text](https://…) inside text → highlighted link
  function linkify(s) {
    return esc(s).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, function (_, t, u) {
      return '<a class="inlink" href="' + u + '" target="_blank" rel="noopener">' + t + "</a>";
    });
  }
  function ext(url) {
    return /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";
  }
  function fill(name, html) {
    document.querySelectorAll('[data-fill="' + name + '"]').forEach(function (el) { el.innerHTML = html; });
  }
  function head(sec, extra) {
    return (
      '<div class="section__head reveal">' +
      (sec.label ? '<p class="label">' + esc(sec.label) + "</p>" : "") +
      (sec.title ? '<h2 class="h2">' + rich(sec.title) + "</h2>" : "") +
      (extra || "") +
      "</div>"
    );
  }
  // "All · Web2 · Web3 · AI & ML" chips (one shared choice across the page)
  function filterBar() {
    var f = S.filters || [];
    if (!f.length) return "";
    return '<div class="filters reveal" role="group" aria-label="Filter by area"><span>Show</span>' +
      f.map(function (x) { return '<button type="button" data-filter="' + esc(x.id) + '" aria-pressed="' + (x.id === "all") + '">' + esc(x.label) + "</button>"; }).join("") +
      "</div>";
  }
  function topicAttr(t) { return t ? ' data-topic="' + esc(t) + '"' : ""; }

  var SPARKLE = '<svg class="sparkle" viewBox="0 0 60 60" aria-hidden="true"><path d="M22 4c1.5 11 5 14.5 16 16-11 1.5-14.5 5-16 16-1.5-11-5-14.5-16-16 11-1.5 14.5-5 16-16z"/><path d="M46 32c.8 5.6 2.5 7.3 8 8-5.5.8-7.2 2.5-8 8-.8-5.5-2.5-7.2-8-8 5.5-.7 7.2-2.4 8-8z"/></svg>';

  /* ---------- accent colour: set in <head>; this wires up the buttons ---------- */
  function applyAccent(mode, remember) {
    var root = document.documentElement;
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
    root.dataset.accent = mode === "daily" ? (day % 2 ? "blue" : "orange") : mode;
    root.dataset.accentMode = mode;
    if (remember) { try { localStorage.setItem("accent", mode); } catch (e) {} }
    document.querySelectorAll("[data-accent-choice]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-accent-choice") === mode ? "true" : "false");
    });
  }

  /* ---------- meta ---------- */
  var p = S.person;
  if (S.meta) {
    document.title = S.meta.title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", S.meta.description);
  }

  /* ---------- nav / hero ---------- */
  fill("logo", esc(p.firstName) + "<b>●</b>" + esc(p.lastName));
  fill("status", esc(S.status));
  fill("headline", S.hero.headline.map(function (l) { return '<span class="line">' + rich(l) + "</span>"; }).join(""));
  fill("intro", esc(S.hero.intro));
  fill(
    "ctas",
    '<a class="btn btn--hot" href="' + esc(S.hero.primaryCta.href) + '">' + esc(S.hero.primaryCta.label) + " →</a>" +
    (function (c) {
      if (!c.options) return '<a class="btn" href="' + esc(c.href) + '" download>' + esc(c.label) + " ↓</a>";
      return '<div class="dl"><button type="button" class="btn" id="dlBtn" aria-expanded="false" aria-controls="dlMenu">' + esc(c.label) + ' <span aria-hidden="true">↓</span></button>' +
        '<div class="dl__menu" id="dlMenu" hidden>' + c.options.map(function (o) {
          return '<a href="' + esc(o.href) + '" download><span>' + esc(o.label) + "</span><small>PDF ↓</small></a>";
        }).join("") + "</div></div>";
    })(S.hero.secondaryCta)
  );
  (function dlMenu() {
    var btn = document.getElementById("dlBtn"), menu = document.getElementById("dlMenu");
    if (!btn) return;
    function set(open) { menu.hidden = !open; btn.setAttribute("aria-expanded", open); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(menu.hidden); });
    document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  })();
  var img = document.querySelector('[data-fill="photo"]');
  if (img) { img.src = p.photo; img.alt = p.photoAlt || p.firstName; }
  fill("stickers", (S.hero.stickers || []).map(function (t) { return '<span class="sticker">' + esc(t) + "</span>"; }).join(""));
  fill("stats", (S.stats || []).map(function (s) {
    return '<li class="reveal"><strong>' + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></li>";
  }).join(""));
  var mq = (S.marquee || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
  fill("marquee", mq + mq); // duplicated for a seamless loop

  /* ---------- sections ---------- */
  var R = {};

  R.about = function (a) {
    return '<div class="wrap about"><div>' + head(a) +
      a.paragraphs.map(function (t) { return '<p class="reveal">' + esc(t) + "</p>"; }).join("") +
      "</div>" +
      (a.photo ? '<figure class="polaroid reveal">' +
        (a.photoLink ? '<a href="' + esc(a.photoLink) + '"' + ext(a.photoLink) + ">" : "") +
        '<img src="' + esc(a.photo) + '" alt="' + esc(a.photoAlt || "") + '" loading="lazy" width="700" height="875" referrerpolicy="no-referrer"' +
        (a.photoFallback ? ' onerror="this.onerror=null;this.src=\'' + esc(a.photoFallback) + '\'"' : "") + " />" +
        (a.photoLink ? "</a>" : "") +
        "<figcaption>" + esc(a.photoCaption || "") + "</figcaption></figure>" : "") +
      "</div>";
  };

  R.experience = function (e) {
    return '<div class="wrap">' + head(e) + '<div class="jobs">' +
      e.items.map(function (j, i) {
        var co = j.url ? '<a href="' + esc(j.url) + '"' + ext(j.url) + ">" + esc(j.company) + "</a>" : esc(j.company);
        return '<article class="card job reveal' + (j.current ? " job--current" : "") + '">' +
          "<div>" +
          '<span class="job__num">[' + String(i + 1).padStart(2, "0") + "]</span>" +
          (j.current ? '<span class="now-pill">NOW</span>' : "") +
          '<h3 class="job__co">' + co + "</h3>" +
          '<p class="job__role">' + esc(j.role) + "</p>" +
          '<p class="job__meta">' + esc(j.period) + (j.location ? "<br>" + esc(j.location) : "") + "</p>" +
          "</div><div>" +
          "<ul>" + (j.points || []).map(function (pt) { return "<li>" + linkify(pt) + "</li>"; }).join("") + "</ul>" +
          '<div class="tags">' + (j.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
          "</div></article>";
      }).join("") + "</div></div>";
  };

  R.lore = function (l) {
    // group cards under their year, keeping the order written in content.js
    var groups = [];
    l.items.forEach(function (it) {
      var g = groups[groups.length - 1];
      if (!g || g.year !== it.year) { g = { year: it.year, items: [] }; groups.push(g); }
      g.items.push(it);
    });
    return '<div class="wrap">' +
      (l.label ? '<p class="label reveal">' + esc(l.label) + "</p><br>" : "") +
      '<h2 class="lore-title reveal">' + esc(l.title) + SPARKLE + "</h2>" +
      '<ol class="lore">' +
      groups.map(function (g) {
        return '<li class="lore__row"><span class="lore__yr reveal">' + esc(g.year) + '</span><div class="lore__cards">' +
          g.items.map(function (it) {
            var inner = (it.when ? '<span class="lore__when">' + esc(it.when) + " " + esc(g.year) + "</span>" : "") +
              "<h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p>" +
              (it.url ? '<span class="lore__go">' + esc(it.linkLabel || "View ↗") + "</span>" : "") +
              (it.links ? '<span class="lore__links">' + it.links.map(function (l) {
                return '<a class="lore__go" href="' + esc(l.url) + '"' + ext(l.url) + ">" + esc(l.label) + "</a>";
              }).join("") + "</span>" : "");
            return it.url
              ? '<a class="lore__item reveal" href="' + esc(it.url) + '"' + ext(it.url) + ">" + inner + "</a>"
              : '<article class="lore__item reveal">' + inner + "</article>";
          }).join("") + "</div></li>";
      }).join("") + "</ol></div>";
  };

  R.projects = function (pr) {
    return '<div class="wrap">' + head(pr, filterBar()) + '<div class="projects">' +
      pr.items.map(function (it) {
        var tagOpen = it.url ? '<a class="card project reveal"' + topicAttr(it.topic) + ' href="' + esc(it.url) + '"' + ext(it.url) + ">" : '<div class="card project reveal"' + topicAttr(it.topic) + ">";
        var tagClose = it.url ? "</a>" : "</div>";
        return tagOpen + '<span class="tag project__kind">' + esc(it.kind) + "</span><h3>" + esc(it.name) + "</h3><p>" + esc(it.text) + "</p>" +
          (it.url ? '<span class="project__go">View ↗</span>' : "") + tagClose;
      }).join("") + "</div>" +
      (pr.moreLink ? '<div class="more reveal"><a class="btn" href="' + esc(pr.moreLink.href) + '"' + ext(pr.moreLink.href) + ">" + esc(pr.moreLink.label) + " ↗</a></div>" : "") +
      "</div>";
  };

  /* ---------- Articles: magazine collage ---------- */
  function statLine(it) {
    var bits = [];
    (it.stats || []).forEach(function (st) { bits.push(esc(st.value) + " " + esc(st.label)); });
    if (it.read) bits.push(esc(it.read) + " read");
    return bits.join(" · ");
  }
  function artImg(it) {
    return '<span class="mag__img" style="--h:' + (it.title.length * 37 % 360) + '">' +
      (it.image ? '<img src="' + esc(it.image) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add(\'noimg\');this.remove()" />' : "") +
      '<b class="mag__imgfb" aria-hidden="true">' + esc(it.kicker || "") + "</b></span>";
  }
  R.articles = function (a) {
    var items = a.items || [];
    if (!items.length) return "";
    var claps = 0;
    items.forEach(function (it) { (it.stats || []).forEach(function (st) { if (/clap/.test(st.label)) claps += parseInt(String(st.value).replace(/\D/g, ""), 10) || 0; }); });
    var cover = items[0], side = items.slice(1, 3), rest = items.slice(3);
    var coverHtml =
      '<article class="mag__cover reveal"' + topicAttr(cover.topic) + ">" +
        '<a class="mag__coverimg" href="' + esc(cover.url) + '"' + ext(cover.url) + ">" + artImg(cover) + '<span class="mag__tag">COVER STORY</span></a>' +
        '<p class="mag__kicker">' + esc(cover.kicker || "") + (cover.pub ? " · " + esc(cover.pub) : "") + " · " + esc(cover.date || "") + "</p>" +
        '<h3 class="mag__h1"><a href="' + esc(cover.url) + '"' + ext(cover.url) + ">" + esc(cover.title) + "</a></h3>" +
        (cover.dek ? '<p class="mag__dek">' + esc(cover.dek) + "</p>" : "") +
        '<div class="mag__bigstats">' + (cover.stats || []).map(function (st) {
          return '<span><strong>' + esc(st.value) + "</strong>" + esc(st.label) + "</span>";
        }).join("") + (cover.read ? "<span><strong>" + esc(cover.read.replace(/ ?min/, "")) + "</strong>min read</span>" : "") + "</div>" +
        '<p class="mag__links"><a href="' + esc(cover.url) + '"' + ext(cover.url) + ">Read on Medium ↗</a>" +
        (cover.also ? ' <a href="' + esc(cover.also.url) + '"' + ext(cover.also.url) + ">" + esc(cover.also.label) + " ↗</a>" : "") + "</p>" +
      "</article>";
    var sideHtml = '<div class="mag__side">' + side.map(function (it) {
      return '<a class="mag__feature reveal"' + topicAttr(it.topic) + ' href="' + esc(it.url) + '"' + ext(it.url) + ">" + artImg(it) +
        '<span class="mag__body"><span class="mag__kicker">' + esc(it.kicker || "") + " · " + esc(it.date || "") + "</span>" +
        '<span class="mag__h2">' + esc(it.title) + "</span>" +
        (it.dek ? '<span class="mag__dek mag__dek--sm">' + esc(it.dek) + "</span>" : "") +
        '<span class="mag__stats">' + statLine(it) + "</span></span></a>";
    }).join("") + "</div>";
    var restHtml = '<div class="mag__grid">' + rest.map(function (it, i) {
      return '<a class="mag__clip reveal r' + (i % 3) + '"' + topicAttr(it.topic) + ' href="' + esc(it.url) + '"' + ext(it.url) + ">" + artImg(it) +
        '<span class="mag__kicker">' + esc(it.kicker || "") + " · " + esc(it.date || "") + "</span>" +
        '<span class="mag__h3">' + esc(it.title) + "</span>" +
        '<span class="mag__stats">' + statLine(it) + "</span></a>";
    }).join("") + "</div>";
    return '<div class="wrap">' + head(a, filterBar()) +
      '<div class="mag">' +
        '<div class="mag__masthead reveal"><span>VOL. 01 · ' + items.length + " STORIES" + (claps ? " · " + claps + " CLAPS" : "") + '</span><b>' + esc(a.masthead || "") + '</b><span>MEDIUM · DEV.TO</span></div>' +
        '<div class="mag__top">' + coverHtml + sideHtml + "</div>" + restHtml +
      "</div>" +
      (a.moreLink ? '<div class="more reveal"><a class="btn" href="' + esc(a.moreLink.href) + '"' + ext(a.moreLink.href) + ">" + esc(a.moreLink.label) + " ↗</a></div>" : "") +
      "</div>";
  };

  /* ---------- Simar TV ---------- */
  function thumb(id) { return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg"; }
  function thumbImg(it, cls) {
    return '<img class="' + cls + '" src="' + thumb(it.id) + '" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\');this.remove()" />';
  }
  R.videos = function (v) {
    var chans = v.channels || [];
    var tabs = chans.map(function (c, i) {
      return '<button type="button" class="guide__tab" role="tab" id="ch-tab-' + i + '" aria-controls="guideList" data-ch="' + i + '">' +
        '<span class="guide__num">CH ' + String(i + 1).padStart(2, "0") + "</span>" + esc(c.name) + "</button>";
    }).join("");
    var featured = [];
    chans.forEach(function (c, ci) { c.items.forEach(function (it, ii) { if (it.featured) featured.push({ it: it, ci: ci, ii: ii }); }); });
    var reel = featured.length ? (
      '<div class="reel">' +
      '<div class="section__head reveal"><p class="label">' + esc((v.reel || {}).label || "") + '</p><h3 class="h2">' + rich((v.reel || {}).title || "") + "</h3></div>" +
      '<div class="reel__grid">' + featured.map(function (f, k) {
        return '<button type="button" class="reel__tile reveal t' + (k % 7) + '" data-ch="' + f.ci + '" data-i="' + f.ii + '" style="--h:' + ((k * 57) % 360) + '">' +
          thumbImg(f.it, "reel__img") +
          '<span class="reel__fallback" aria-hidden="true">' + esc(f.it.title) + "</span>" +
          '<span class="reel__meta"><span class="reel__title">' + esc(f.it.title) + "</span><span>" + esc(f.it.by || "") + " · " + esc(f.it.duration || "") + "</span></span>" +
          '<span class="reel__play" aria-hidden="true"></span></button>';
      }).join("") + "</div></div>") : "";
    return '<div class="wrap">' +
      '<div class="videos__head">' + head(v, '<p class="lead">' + esc(v.text) + "</p>") +
      '<a class="btn reveal" href="' + esc(v.cta.href) + '"' + ext(v.cta.href) + ">" + esc(v.cta.label) + " ↗</a></div>" +
      '<div class="studio">' +
        '<div class="tv" id="tv">' +
          '<div class="tv__screen" id="tvScreen" aria-live="polite"></div>' +
          '<div class="tv__panel">' +
            '<div class="tv__display"><span class="tv__led" id="tvLed"></span><span id="tvChan">CH 01</span><span class="tv__now" id="tvNow"></span></div>' +
            '<div class="tv__keys">' +
              '<button type="button" class="tv__key" id="tvPrev" aria-label="Previous video">◀◀</button>' +
              '<button type="button" class="tv__key tv__key--play" id="tvPlay" aria-label="Play">▶</button>' +
              '<button type="button" class="tv__key" id="tvNext" aria-label="Next video">▶▶</button>' +
              '<button type="button" class="tv__key" id="tvChUp" aria-label="Next channel">CH+</button>' +
            "</div>" +
          "</div>" +
          '<div class="tv__legs" aria-hidden="true"><span></span><span></span></div>' +
        "</div>" +
        '<div class="guide">' +
          '<div class="guide__head"><span>TV GUIDE</span><a id="guideAll" href="#"' + ext("https://") + ">Full playlist ↗</a></div>" +
          '<div class="guide__tabs" role="tablist" aria-label="Channels">' + tabs + "</div>" +
          '<p class="guide__blurb" id="guideBlurb"></p>' +
          '<ol class="guide__list" id="guideList" role="tabpanel"></ol>' +
        "</div>" +
      "</div>" + reel + "</div>";
  };

  var LOCAL_FILE = location.protocol === "file:";

  function initTV() {
    var v = S.videos;
    var tv = document.getElementById("tv");
    if (!v || !tv) return;
    var chans = v.channels;
    var st = { ch: 0, i: 0, playing: false };
    var screen = document.getElementById("tvScreen");
    var list = document.getElementById("guideList");
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function cur() { return chans[st.ch].items[st.i]; }
    function renderScreen() {
      var it = cur();
      var yt = "https://www.youtube.com/watch?v=" + encodeURIComponent(it.id);
      if (st.playing && !window.__PREVIEW__ && !LOCAL_FILE) {
        // YouTube needs to know which site is embedding it. Without a Referer header
        // (file:// pages, or a no-referrer policy) the player shows "Error 153".
        screen.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(it.id) +
          "?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1&origin=" + encodeURIComponent(location.origin) +
          '" title="' + esc(it.title) + '" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen; web-share" allowfullscreen></iframe>';
      } else {
        screen.innerHTML =
          '<button type="button" class="tv__cover" id="tvCover" aria-label="Play ' + esc(it.title) + '">' +
          thumbImg(it, "tv__thumb") +
          '<span class="tv__fallback">' + esc(it.title) + "</span>" +
          '<span class="tv__scan" aria-hidden="true"></span>' +
          '<span class="tv__bigplay" aria-hidden="true"></span>' +
          '<span class="tv__osd"><b>' + esc(it.title) + "</b><span>" + esc((it.by ? it.by + " · " : "") + (it.duration || "")) + "</span></span></button>" +
          (st.playing && (window.__PREVIEW__ || LOCAL_FILE) ? '<p class="tv__note">' + (LOCAL_FILE ? "YouTube won't play videos on a page opened straight from your disk. Run a local server (see README) or deploy, and it plays right here. " : "Videos play inline on the deployed site. ") + '<a href="' + yt + '" target="_blank" rel="noopener">Open on YouTube ↗</a></p>' : "");
        document.getElementById("tvCover").addEventListener("click", function () { play(); });
      }
      document.getElementById("tvChan").textContent = "CH " + String(st.ch + 1).padStart(2, "0") + " · " + chans[st.ch].name;
      document.getElementById("tvNow").textContent = (st.i + 1) + "/" + chans[st.ch].items.length;
      document.getElementById("tvLed").classList.toggle("on", st.playing);
      var pb = document.getElementById("tvPlay");
      pb.textContent = st.playing ? "■" : "▶";
      pb.setAttribute("aria-label", st.playing ? "Stop" : "Play");
      [].forEach.call(list.children, function (li, k) {
        li.firstChild.setAttribute("aria-current", k === st.i ? "true" : "false");
      });
    }
    function renderGuide() {
      var c = chans[st.ch];
      document.getElementById("guideBlurb").textContent = c.blurb || "";
      var all = document.getElementById("guideAll");
      all.href = c.playlist || v.cta.href;
      list.innerHTML = c.items.map(function (it, k) {
        return '<li><button type="button" data-i="' + k + '">' +
          '<span class="guide__thumb">' + thumbImg(it, "") + "</span>" +
          '<span class="guide__txt"><b>' + esc(it.title) + "</b><small>" + esc((it.by ? it.by + " · " : "") + (it.duration || "")) + "</small></span></button></li>";
      }).join("");
      document.querySelectorAll(".guide__tab").forEach(function (t, k) { t.setAttribute("aria-selected", k === st.ch ? "true" : "false"); });
    }
    function zap() {
      if (reduce) return;
      tv.classList.remove("zap"); void tv.offsetWidth; tv.classList.add("zap");
    }
    function go(ch, i, autoplay) {
      var chChanged = ch !== st.ch;
      st.ch = ch; st.i = i; st.playing = !!autoplay;
      if (chChanged) renderGuide();
      zap(); renderScreen();
    }
    function play() { st.playing = true; renderScreen(); }

    list.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-i]"); if (!b) return;
      go(st.ch, +b.dataset.i, true);
      if (innerWidth < 900) tv.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
    document.querySelectorAll(".guide__tab").forEach(function (t) {
      t.addEventListener("click", function () { go(+t.dataset.ch, 0, false); });
    });
    document.querySelectorAll(".reel__tile").forEach(function (t) {
      t.addEventListener("click", function () {
        go(+t.dataset.ch, +t.dataset.i, true);
        tv.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      });
    });
    document.getElementById("tvPlay").addEventListener("click", function () { st.playing ? (st.playing = false, renderScreen()) : play(); });
    document.getElementById("tvNext").addEventListener("click", function () { go(st.ch, (st.i + 1) % chans[st.ch].items.length, st.playing); });
    document.getElementById("tvPrev").addEventListener("click", function () { var n = chans[st.ch].items.length; go(st.ch, (st.i - 1 + n) % n, st.playing); });
    document.getElementById("tvChUp").addEventListener("click", function () { go((st.ch + 1) % chans.length, 0, false); });

    renderGuide(); renderScreen();
  }

  /* ---------- Posts from X ---------- */
  R.posts = function (x) {
    var items = x.items || [];
    if (!items.length) return "";
    return '<div class="wrap">' + head(x, x.text ? '<p class="lead">' + esc(x.text) + "</p>" : "") +
      '<div class="xgrid">' + items.map(function (t) {
        var url = t.url.replace("//twitter.com/", "//x.com/");
        return '<article class="xpost reveal' + (t.pinned ? " xpost--pinned" : "") + '">' +
          (t.pinned ? '<span class="xpost__pin">PINNED</span>' : "") +
          '<div class="xpost__embed" data-tweet="' + esc(url) + '">' +
            '<div class="xpost__fallback card">' +
              '<p class="xpost__who"><b>' + esc(t.byName || x.name || "") + '</b> <span>' + esc(t.by || x.handle || "") + "</span></p>" +
              (t.text ? "<p>" + esc(t.text) + "</p>" : "") +
              (t.video ? '<p class="xpost__vid">▶ Video · ' + esc(t.video) + "</p>" : "") +
              (t.likes ? '<p class="xpost__likes">♥ ' + esc(t.likes) + " likes</p>" : "") +
              '<p class="xpost__meta">' + esc(t.date || "") + ' · <a href="' + esc(url) + '" target="_blank" rel="noopener">View on X ↗</a></p>' +
            "</div>" +
          "</div></article>";
      }).join("") + "</div>" +
      (x.cta ? '<div class="more reveal"><a class="btn" href="' + esc(x.cta.href) + '"' + ext(x.cta.href) + ">" + esc(x.cta.label) + " ↗</a></div>" : "") +
      "</div>";
  };

  // Load X's official embed only when the posts scroll near, then swap the fallback card for it.
  function initPosts() {
    var boxes = document.querySelectorAll(".xpost__embed");
    if (!boxes.length || window.__PREVIEW__) return;
    var loaded = false;
    function isDark() {
      var t = document.documentElement.dataset.theme;
      return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function render() {
      boxes.forEach(function (box) {
        if (box.dataset.done) return;
        box.dataset.done = "1";
        var url = box.dataset.tweet.replace("//x.com/", "//twitter.com/");
        var id = (url.match(/status\/(\d+)/) || [])[1];
        if (!id || !window.twttr || !twttr.widgets) return;
        var holder = document.createElement("div");
        box.appendChild(holder);
        twttr.widgets.createTweet(id, holder, { theme: isDark() ? "dark" : "light", dnt: true, align: "center" })
          .then(function (el) { if (el) box.classList.add("is-live"); else holder.remove(); });
      });
    }
    function load() {
      if (loaded) return; loaded = true;
      var sc = document.createElement("script");
      sc.src = "https://platform.twitter.com/widgets.js"; sc.async = true; sc.charset = "utf-8";
      sc.onload = function () { twttr.ready(render); };
      document.body.appendChild(sc);
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { if (en.some(function (e) { return e.isIntersecting; })) { load(); io.disconnect(); } }, { rootMargin: "600px 0px" });
      boxes.forEach(function (b) { io.observe(b); });
    } else load();
  }

  R.playbook = function (pb) {
    return '<div class="wrap">' + head(pb, pb.text ? '<p class="lead">' + esc(pb.text) + "</p>" : "") +
      '<div class="play">' + pb.cards.map(function (c, i) {
        return '<article class="play__card reveal">' +
          '<span class="play__n">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<h3 class="play__skill">' + esc(c.skill) + "</h3>" +
          '<p class="play__value">' + esc(c.value) + "</p>" +
          '<p class="play__unit">' + esc(c.unit) + "</p>" +
          '<p class="play__text">' + esc(c.text) + "</p></article>";
      }).join("") + "</div>" +
      (pb.alsoAt && pb.alsoAt.length ? '<div class="also reveal"><p class="also__label">Also at home in</p><ul class="also__list">' +
        pb.alsoAt.map(function (x) { return '<li><b>' + esc(x.title) + "</b><span>" + esc(x.text) + "</span></li>"; }).join("") + "</ul></div>" : "") +
      "</div>";
  };

  R.skills = function (s) {
    return '<div class="wrap">' + head(s, filterBar()) + '<div class="skills">' +
      s.groups.map(function (g) {
        return '<div class="card skills__group reveal"' + topicAttr(g.topic) + '><h3>' + esc(g.name) + '</h3><ul class="chips">' +
          g.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div></div>";
  };

  document.querySelectorAll("[data-section]").forEach(function (el) {
    var key = el.getAttribute("data-section");
    var data = S[key];
    if (!data || data.show === false || !R[key]) { el.remove(); var link = document.querySelector('.nav__links a[href="#' + el.id + '"]'); if (link) link.remove(); return; }
    var html = R[key](data);
    if (!html) { el.remove(); var l2 = document.querySelector('.nav__links a[href="#' + el.id + '"]'); if (l2) l2.remove(); return; }
    el.innerHTML = html;
  });

  initTV();
  initPosts();

  /* ---------- menu: built from the sections, in page order ---------- */
  (function buildNav() {
    var nav = document.getElementById("navLinks");
    var html = "";
    document.querySelectorAll("main section[data-section]").forEach(function (el) {
      var d = S[el.getAttribute("data-section")];
      var label = (d && d.nav) || el.id.charAt(0).toUpperCase() + el.id.slice(1);
      html += '<a href="#' + el.id + '">' + esc(label) + "</a>";
    });
    nav.innerHTML = html;
  })();

  /* ---------- contact + footer ---------- */
  var c = S.contact;
  fill("contactLabel", esc(c.label));
  fill("contactTitle", rich(c.title));
  fill("contactText", esc(c.text));
  document.querySelectorAll('[data-fill="email"]').forEach(function (a) { a.href = "mailto:" + p.email; a.textContent = p.email; });
  fill("socials", S.socials.map(function (s) {
    return '<li><a href="' + esc(s.url) + '"' + ext(s.url) + "><span>" + esc(s.name) + "</span><small>" + esc(s.handle) + "</small></a></li>";
  }).join(""));
  fill("footerName", esc(p.firstName) + "<br><span>" + esc(p.lastName) + '</span><i class="footer__dot" aria-hidden="true">.</i>');
  fill("footerLinks", S.socials.map(function (s) { return '<li><a href="' + esc(s.url) + '"' + ext(s.url) + ">" + esc(s.name) + "</a></li>"; }).join(""));
  fill("copyright", "© " + new Date().getFullYear() + " " + esc(p.firstName + " " + p.lastName));
  fill("footerLine", esc(S.footer.line));

  /* ---------- contact form → Formspree (no backend) ---------- */
  var form = document.getElementById("contactForm");
  var msg = document.getElementById("formMsg");
  if (form) {
    form.action = c.formspree;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        msg.className = "form__msg err";
        msg.textContent = "Please fill in your name, a valid email and a message.";
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true; btn.style.opacity = 0.7;
      msg.className = "form__msg"; msg.textContent = "Sending…";
      fetch(c.formspree, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            msg.className = "form__msg ok";
            msg.textContent = "Thanks! Your message is in. I'll get back to you soon.";
            form.reset();
          } else {
            throw new Error(res.j && res.j.errors ? res.j.errors.map(function (x) { return x.message; }).join(", ") : "Request failed");
          }
        })
        .catch(function () {
          msg.className = "form__msg err";
          msg.innerHTML = 'Oops, that didn\'t go through. Email me directly at <a href="mailto:' + esc(p.email) + '">' + esc(p.email) + "</a>.";
        })
        .finally(function () { btn.disabled = false; btn.style.opacity = ""; });
    });
  }

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  document.getElementById("themeToggle").addEventListener("click", function () {
    var isDark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var links = document.getElementById("navLinks");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- keep giant type (hero headline, footer name) inside the screen ---------- */
  function fitType() {
    [[".hero__title", ".hero__copy"], [".footer__name", ".footer__inner"]].forEach(function (pair) {
      var el = document.querySelector(pair[0]), box = document.querySelector(pair[1]);
      if (!el || !box) return;
      el.style.fontSize = "";
      var size = parseFloat(getComputedStyle(el).fontSize);
      var widest = 0;
      [].forEach.call(el.children.length ? el.children : [el], function (c) { widest = Math.max(widest, c.scrollWidth); });
      widest = Math.max(widest, el.scrollWidth);
      var avail = box.clientWidth - 12; // leave room for hard shadows
      if (widest > avail) el.style.fontSize = Math.floor(size * avail / widest) + "px";
    });
  }
  fitType();
  addEventListener("resize", fitType);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitType);

  /* ---------- All / Web2 / Web3 / AI filter (shared across sections) ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-filter]");
    if (!b || !b.closest(".filters")) return;
    var id = b.getAttribute("data-filter");
    if (id === "all") delete document.documentElement.dataset.filter;
    else document.documentElement.dataset.filter = id;
    document.querySelectorAll(".filters [data-filter]").forEach(function (x) {
      x.setAttribute("aria-pressed", x.getAttribute("data-filter") === id ? "true" : "false");
    });
  });

  /* ---------- colour buttons (nav swatch + footer picker) ---------- */
  applyAccent(document.documentElement.dataset.accentMode || S.accent || "orange", false);
  document.querySelectorAll("[data-accent-choice]").forEach(function (b) {
    b.addEventListener("click", function () { applyAccent(b.getAttribute("data-accent-choice"), true); });
  });

  /* ---------- coin-flip colour game (footer) ---------- */
  (function coinGame() {
    var coin = document.getElementById("coin"), inner = document.getElementById("coinInner");
    if (!coin || !inner) return;
    var result = document.getElementById("vibeResult"), countEl = document.getElementById("flipCount"), statsEl = document.getElementById("vibeStats");
    var score = { flips: 0, orange: 0, blue: 0 };
    try { score = JSON.parse(localStorage.getItem("coinScore")) || score; } catch (e) {}
    var turns = document.documentElement.dataset.accent === "blue" ? 1 : 0; // half-turns so far
    inner.style.transform = "rotateY(" + turns * 180 + "deg)";
    var lines = {
      orange: ["Heads! Warm, loud, event-host energy.", "Orange it is. Pizza-party approved.", "Heads again. The page is on fire (nicely)."],
      blue: ["Tails! Calm, cool, builder mode.", "Blue it is. Simar's favourite, secretly.", "Tails. Deep-focus, ship-it blue."]
    };
    function show() {
      countEl.textContent = score.flips;
      statsEl.textContent = score.flips ? "Your tally: " + score.orange + " orange · " + score.blue + " blue" : "";
    }
    var busy = false;
    coin.addEventListener("click", function () {
      if (busy) return; busy = true;
      var land = Math.random() < 0.5 ? "orange" : "blue";
      var from = turns;
      turns += 8 + ((from % 2 === 0) === (land === "orange") ? 0 : 1); // spin 4+ times, land on the right face
      coin.classList.add("flipping");
      inner.style.transform = "rotateY(" + turns * 180 + "deg)";
      result.textContent = "Flipping…";
      setTimeout(function () {
        coin.classList.remove("flipping");
        applyAccent(land, true);
        score.flips++; score[land]++;
        try { localStorage.setItem("coinScore", JSON.stringify(score)); } catch (e) {}
        var pool = lines[land];
        result.textContent = pool[score[land] % pool.length];
        show(); busy = false;
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 1600);
    });
    document.querySelectorAll("[data-accent-choice]").forEach(function (b) {
      b.addEventListener("click", function () {
        var acc = document.documentElement.dataset.accent;
        if ((turns % 2 === 1) !== (acc === "blue")) { turns++; inner.style.transform = "rotateY(" + turns * 180 + "deg)"; }
        result.textContent = b.getAttribute("data-accent-choice") === "daily" ? "Daily swap is on: orange and blue take turns every day." : "Locked in: " + acc + ".";
      });
    });
    show();
  })();

  /* ---------- hero: stickers and photo follow the cursor ---------- */
  (function heroParallax() {
    var media = document.querySelector(".hero__media");
    if (!media || matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover)").matches) return;
    var raf = 0;
    media.addEventListener("mousemove", function (e) {
      var r = media.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2, y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { media.style.setProperty("--mx", x.toFixed(3)); media.style.setProperty("--my", y.toFixed(3)); });
    });
    media.addEventListener("mouseleave", function () { media.style.setProperty("--mx", 0); media.style.setProperty("--my", 0); });
  })();

  /* ---------- floating back-to-top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.hidden = false;
    var onScroll = function () { toTop.classList.toggle("show", scrollY > 600); };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    toTop.addEventListener("click", function (e) {
      e.preventDefault();
      scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", location.pathname + location.search);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }
})();
