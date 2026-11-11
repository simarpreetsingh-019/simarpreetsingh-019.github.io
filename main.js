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
  if (S.meta && (document.body.getAttribute("data-page") || "home") === "home") { // extra pages keep their own title
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
      var o = c.options && c.options.length ? c.options : [{ href: c.href }];
      return '<a class="btn" href="' + esc(o[0].href) + '" download>' + esc(c.label) + ' <span aria-hidden="true">↓</span></a>' +
        (o.length > 1 ? '<span class="cv-alt">or ' + o.slice(1).map(function (x) { return '<a href="' + esc(x.href) + '" download>' + esc(x.label) + " ↓</a>"; }).join(" · ") + "</span>" : "");
    })(S.hero.secondaryCta)
  );
  var av = document.querySelector('[data-fill="avail"]');
  if (av) {
    if (S.hero.availability) av.innerHTML = '<i aria-hidden="true"></i><span class="avail__txt"><span>' + esc(S.hero.availability) + ' <span aria-hidden="true">→</span></span>' +
      (S.hero.location ? '<small class="avail__loc">' + esc(S.hero.location) + "</small>" : "") + "</span>";
    else av.remove();
  }
  var img = document.querySelector('[data-fill="photo"]');
  if (img) { img.src = p.photo; img.alt = p.photoAlt || p.firstName; }
  fill("stickers", (S.hero.stickers || []).map(function (t) { return '<span class="sticker">' + esc(t) + "</span>"; }).join(""));
  fill("stats", (S.stats || []).map(function (s) {
    return '<li class="reveal"><strong>' + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></li>";
  }).join(""));
  // "Worked with · spoke at" names scroll across the black strip (second copy only makes the loop seamless)
  var L = S.logos || {}, names = L.items || [];
  var mq = names.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
  fill("marqueeLabel", esc(L.label || ""));
  fill("marquee", mq + mq.replace(/<span>/g, '<span aria-hidden="true">'));

  /* ---------- old links (#videos, #articles, #lore, #posts) now live on their own pages ---------- */
  (function legacyLinks() {
    var h = location.hash.slice(1);
    if (!h || document.getElementById(h)) return;
    (S.pages || []).forEach(function (pg) {
      (pg.sections || []).forEach(function (sec) {
        var ids = { videos: "videos", articles: "articles", lore: "lore", posts: "posts" };
        if (ids[sec] === h) location.replace(pg.path + "#" + h);
      });
    });
  })();
  // extra pages use <base href="../">, so keep the "skip to content" link on the current page
  if (document.querySelector("base")) document.querySelectorAll('a[href="#main"]').forEach(function (a) { a.href = location.pathname + "#main"; });

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

  // bullets beyond the first N are folded behind "Show more" (still in the page for crawlers)
  function points(list, keep) {
    list = list || [];
    var extra = keep && list.length > keep ? list.length - keep : 0;
    return "<ul>" + list.map(function (pt, k) { return '<li' + (extra && k >= keep ? ' class="xtra"' : "") + ">" + linkify(pt) + "</li>"; }).join("") + "</ul>" +
      (extra ? '<button type="button" class="more-btn" data-more aria-expanded="false" data-label="Show ' + extra + ' more">Show ' + extra + " more</button>" : "");
  }
  R.experience = function (e) {
    var phone = matchMedia("(max-width: 600px)").matches;
    var keep = (phone && e.showPointsPhone) || e.showPoints || 0;
    return '<div class="wrap">' + head(e, e.text ? '<p class="lead">' + esc(e.text) + "</p>" : "") + '<div class="jobs">' +
      e.items.map(function (j, i) {
        var co = j.url ? '<a href="' + esc(j.url) + '"' + ext(j.url) + ">" + esc(j.company) + "</a>" : esc(j.company);
        var up = j.stepUp;
        var upHtml = up ? '<div class="stepup">' +
          '<p class="stepup__tag"><span aria-hidden="true">↑</span> Step up · ' + esc(up.period) + "</p>" +
          '<h4 class="stepup__role">' + esc(up.role) + ", " + (up.url ? '<a href="' + esc(up.url) + '"' + ext(up.url) + ">" + esc(up.company) + "</a>" : esc(up.company)) + "</h4>" +
          points(up.points, 0) +
          '<div class="tags">' + (up.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></div>" : "";
        return '<article class="card job reveal' + (j.current ? " job--current" : "") + (j.compact ? " job--compact" : "") + '">' +
          "<div>" +
          '<span class="job__num">[' + String(i + 1).padStart(2, "0") + "]</span>" +
          (j.current ? '<span class="now-pill">NOW</span>' : "") +
          '<h3 class="job__co">' + co + "</h3>" +
          '<p class="job__role">' + esc(j.role) + "</p>" +
          '<p class="job__meta">' + esc(j.period) + (j.location ? "<br>" + esc(j.location) : "") + "</p>" +
          (up ? '<p class="job__up">+ ' + esc(up.role) + ", " + esc(up.company.split(" — ")[0]) + "</p>" : "") +
          '</div><div class="fold">' +
          points(j.points, j.compact ? 1 : keep) + upHtml +
          '<div class="tags">' + (j.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
          "</div></article>";
      }).join("") + "</div></div>";
  };

  /* ---------- Lore: the story in chapters (oldest → newest) ---------- */
  R.lore = function (l) {
    var chapters = l.chapters && l.chapters.length ? l.chapters : null;
    if (!chapters) { // no chapters set: one chapter per year
      var ys = []; l.items.forEach(function (it) { if (ys.indexOf(it.year) < 0) ys.unshift(it.year); });
      chapters = ys.map(function (y) { return { title: y, years: [y] }; });
    }
    var keep = l.showPerChapter || 4;
    var html = chapters.map(function (ch, ci) {
      var moments = l.items.filter(function (it) { return ch.years.indexOf(it.year) >= 0; }).reverse(); // oldest first inside a chapter
      if (!moments.length) return "";
      var extra = Math.max(0, moments.length - keep);
      var yr = ch.years.length > 1 ? ch.years[0] + "–" + ch.years[ch.years.length - 1].slice(-2) : ch.years[0];
      return '<li class="chap reveal fold">' +
        '<p class="chap__num">CH.' + (ci + 1) + "<span>" + esc(yr) + "</span></p>" +
        '<h3 class="chap__title">' + esc(ch.title) + "</h3>" +
        (ch.blurb ? '<p class="chap__blurb">' + esc(ch.blurb) + "</p>" : "") +
        '<ol class="chap__list">' + moments.map(function (it, k) {
          var links = (it.url ? [{ label: it.linkLabel || "View ↗", url: it.url }] : []).concat(it.links || []);
          return "<li" + (k >= keep ? ' class="xtra"' : "") + "><details>" +
            '<summary><span class="chap__when">' + esc((it.when ? it.when + " " : "") + it.year) + "</span>" +
            '<span class="chap__mt">' + esc(it.title) + "</span></summary>" +
            '<div class="chap__body"><p>' + esc(it.text) + "</p>" +
            (links.length ? '<p class="chap__links">' + links.map(function (x) { return '<a href="' + esc(x.url) + '"' + ext(x.url) + ">" + esc(x.label) + "</a>"; }).join("") + "</p>" : "") +
            "</div></details></li>";
        }).join("") + "</ol>" +
        (extra ? '<button type="button" class="more-btn chap__more" data-more aria-expanded="false" data-label="+' + extra + ' more">+' + extra + " more</button>" : "") +
        "</li>";
    }).join("");
    return '<div class="wrap">' +
      '<div class="lore__head">' +
        "<div>" + (l.label ? '<p class="label reveal">' + esc(l.label) + "</p><br>" : "") +
        '<h2 class="lore-title reveal">' + esc(l.title) + SPARKLE + "</h2></div>" +
        (l.text ? '<p class="lore__text reveal">' + esc(l.text) + "</p>" : "") +
      "</div>" +
      '<ol class="chapters">' + html + "</ol>" +
      "</div>";
  };

  /* ---------- Home: three doors to the Talks / Writing / Story pages ---------- */
  R.explore = function (x) {
    var pages = S.pages || [];
    if (!pages.length) return "";
    function stat(n, label) { return "<span><b>" + esc(n) + "</b> " + esc(label) + "</span>"; }
    var doors = pages.map(function (pg) {
      var body = "", meta = "";
      if (pg.id === "talks" && S.videos) {
        var vids = [], feat = null;
        S.videos.channels.forEach(function (c) { c.items.forEach(function (it) { vids.push(it); if (it.featured && !feat) feat = it; }); });
        feat = feat || vids[0];
        body = '<span class="door2__tv">' + (feat ? thumbImg(feat, "door2__thumb") + '<span class="door2__play" aria-hidden="true"></span><span class="door2__now">' + esc(feat.title) + "</span>" : "") + "</span>";
        var more = [];
        S.videos.channels.forEach(function (c) { c.items.forEach(function (it) { if (it.featured && it !== feat && more.length < 2) more.push(it); }); });
        body += more.length ? '<ul class="door2__list">' + more.map(function (it) { return "<li><small>" + esc(it.by || "") + "</small>" + esc(it.title) + "</li>"; }).join("") + "</ul>" : "";
        meta = stat(vids.length, "videos") + stat(S.videos.channels.length, "channels");
      } else if (pg.id === "writing" && S.articles) {
        var a = S.articles.items, claps = 0;
        a.forEach(function (it) { (it.stats || []).forEach(function (st) { if (/clap/.test(st.label)) claps += parseInt(String(st.value).replace(/\D/g, ""), 10) || 0; }); });
        body = '<ol class="door2__heads">' + a.slice(0, 3).map(function (it) { return "<li><small>" + esc(it.kicker || "") + "</small>" + esc(it.title) + "</li>"; }).join("") + "</ol>";
        meta = stat(a.length, "stories") + (claps ? stat(claps, "claps") : "");
      } else if (pg.id === "story" && S.lore) {
        var ch = S.lore.chapters || [];
        body = '<ol class="door2__chaps">' + ch.map(function (c, i) { return "<li><small>CH." + (i + 1) + "</small>" + esc(c.title) + "</li>"; }).join("") + "</ol>";
        var ys = S.lore.items.map(function (it) { return +it.year; });
        meta = stat(S.lore.items.length, "moments") + stat(Math.min.apply(null, ys) + "–" + Math.max.apply(null, ys), "");
      }
      return '<a class="door2 door2--' + esc(pg.id) + ' reveal" href="' + esc(pg.path) + '">' +
        '<span class="door2__label">' + esc(pg.label) + "</span>" +
        '<span class="door2__teaser">' + esc(pg.teaser || "") + "</span>" + body +
        '<span class="door2__meta">' + meta + "</span>" +
        '<span class="door2__cta">' + esc(pg.cta || "Open") + " →</span></a>";
    }).join("");
    return '<div class="wrap">' + head(x) + '<div class="doors2">' + doors + "</div></div>";
  };

  /* ---------- Testimonials (hidden until content.js has quotes) ---------- */
  R.testimonials = function (t) {
    var items = (t.items || []).filter(function (x) { return x.quote; });
    if (!items.length) return "";
    return '<div class="wrap">' + head(t) + '<div class="quotes">' + items.map(function (q, k) {
      return '<figure class="quote reveal q' + (k % 3) + '"><blockquote>' + esc(q.quote) + "</blockquote>" +
        "<figcaption><b>" + (q.url ? '<a href="' + esc(q.url) + '"' + ext(q.url) + ">" + esc(q.name) + "</a>" : esc(q.name || "")) + "</b>" +
        (q.role ? "<span>" + esc(q.role) + "</span>" : "") + "</figcaption></figure>";
    }).join("") + "</div></div>";
  };

  /* ---------- Projects: big cards, then a rotating ring with a Quick Look panel ---------- */
  function projCard(it) {
    var tagOpen = it.url ? '<a class="card project reveal"' + topicAttr(it.topic) + ' href="' + esc(it.url) + '"' + ext(it.url) + ">" : '<div class="card project reveal"' + topicAttr(it.topic) + ">";
    return tagOpen + '<span class="tag project__kind">' + esc(it.kind) + "</span><h3>" + esc(it.name) + "</h3><p>" + esc(it.text) + "</p>" + stackHtml(it) +
      (it.url ? '<span class="project__go">View ↗</span>' : "") + (it.url ? "</a>" : "</div>");
  }
  function stackHtml(it) {
    return it.stack && it.stack.length ? '<ul class="stack" aria-label="Built with">' + it.stack.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "";
  }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  R.projects = function (pr) {
    var n = pr.featured == null ? 4 : pr.featured;
    var top = pr.items.slice(0, n), rest = pr.items.slice(n);
    var ring = rest.length ? (
      '<div class="ringwrap reveal" id="ringwrap">' +
        '<div class="ringwrap__head"><h3 class="ringwrap__title">More side quests <span>· ' + rest.length + "</span></h3>" +
        '<p class="ringwrap__hint">Drag the ring or use the arrows · click to preview</p></div>' +
        '<div class="ringwrap__body">' +
          '<div class="ring" id="ring" tabindex="0" role="listbox" aria-label="More projects">' +
            '<div class="ring__spin" id="ringSpin" style="--n:' + rest.length + '">' +
            rest.map(function (it, k) {
              return '<button type="button" role="option" class="ring__item" style="--k:' + k + '" data-k="' + k + '"' + topicAttr(it.topic) + ' aria-selected="false">' +
                '<span class="ring__kind">' + esc(it.kind) + "</span>" +
                '<span class="ring__name">' + esc(it.name) + "</span>" +
                '<span class="ring__host">' + esc(host(it.url)) + "</span></button>";
            }).join("") + "</div>" +
            '<button type="button" class="ring__arrow ring__arrow--l" data-step="-1" aria-label="Previous project">←</button>' +
            '<button type="button" class="ring__arrow ring__arrow--r" data-step="1" aria-label="Next project">→</button>' +
          "</div>" +
          '<div class="ql" id="ql" aria-live="polite">' +
            '<div class="ql__bar"><i></i><i></i><i></i><span id="qlFile"></span></div>' +
            '<div class="ql__body" id="qlBody"></div>' +
          "</div>" +
        "</div>" +
        '<ul class="ring__data" hidden>' + rest.map(function (it) {
          return "<li>" + (it.url ? '<a href="' + esc(it.url) + '">' + esc(it.name) + "</a>" : esc(it.name)) + ": " + esc(it.text) + "</li>";
        }).join("") + "</ul>" +
      "</div>") : "";
    return '<div class="wrap">' + head(pr, filterBar()) + '<div class="projects">' + top.map(projCard).join("") + "</div>" + ring +
      (pr.moreLink ? '<div class="more reveal"><a class="btn" href="' + esc(pr.moreLink.href) + '"' + ext(pr.moreLink.href) + ">" + esc(pr.moreLink.label) + " ↗</a></div>" : "") +
      "</div>";
  };

  function initRing() {
    var ring = document.getElementById("ring");
    if (!ring) return;
    var pr = S.projects, rest = pr.items.slice(pr.featured == null ? 4 : pr.featured);
    var spin = document.getElementById("ringSpin"), items = [].slice.call(ring.querySelectorAll(".ring__item"));
    var n = items.length, pos = 0, cur = 0;
    // items sit on a flat circle seen from the front: the selected one is big and in front
    function paint(anim) {
      var Rx = Math.min(250, ring.clientWidth * 0.36);
      spin.classList.toggle("still", !anim);
      items.forEach(function (b, k) {
        var th = (k - pos) * 2 * Math.PI / n, c = Math.cos(th), depth = (c + 1) / 2;
        b.style.transform = "translate(-50%, -50%) translateX(" + (Math.sin(th) * Rx).toFixed(1) + "px) translateY(" + ((1 - depth) * -26).toFixed(1) + "px) scale(" + (0.62 + 0.38 * depth).toFixed(3) + ") rotate(" + (Math.sin(th) * 6).toFixed(2) + "deg)";
        b.style.zIndex = Math.round(depth * 100);
        b.style.setProperty("--op", (0.5 + 0.5 * depth).toFixed(2));
        b.tabIndex = -1;
      });
    }
    function show(k) {
      cur = k;
      items.forEach(function (b, j) { b.setAttribute("aria-selected", j === k ? "true" : "false"); });
      var it = rest[k];
      document.getElementById("qlFile").textContent = it.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".project";
      document.getElementById("qlBody").innerHTML =
        '<span class="tag">' + esc(it.kind) + "</span>" +
        "<h4>" + esc(it.name) + "</h4><p>" + esc(it.text) + "</p>" + stackHtml(it) +
        '<dl><div><dt>Area</dt><dd>' + esc(({ web2: "Web2", web3: "Web3", ai: "AI & ML" })[it.topic] || "—") + "</dd></div>" +
        (it.url ? "<div><dt>Where</dt><dd>" + esc(host(it.url)) + "</dd></div>" : "") +
        "<div><dt>No.</dt><dd>" + (k + 1) + " of " + n + "</dd></div></dl>" +
        (it.url ? '<a class="btn btn--sm btn--hot" href="' + esc(it.url) + '"' + ext(it.url) + ">Open ↗</a>" : "");
    }
    function go(k) { var d = ((k - cur) % n + n) % n; if (d > n / 2) d -= n; pos += d; paint(true); show(((k % n) + n) % n); }
    ring.addEventListener("click", function (e) {
      if (dragged) return;
      var a = e.target.closest(".ring__arrow"); if (a) { go(cur + +a.dataset.step); return; }
      var b = e.target.closest(".ring__item"); if (b) go(+b.dataset.k);
    });
    ring.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
    });
    var start = null, dragged = false;
    ring.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".ring__arrow")) return;
      start = { x: e.clientX, p: pos }; dragged = false;
    });
    addEventListener("pointermove", function (e) {
      if (!start) return;
      var dx = e.clientX - start.x;
      if (Math.abs(dx) > 6) dragged = true;
      if (dragged) { pos = start.p - dx / 160; paint(false); }
    });
    addEventListener("pointerup", function () {
      if (!start) return; start = null;
      if (dragged) { pos = Math.round(pos); paint(true); show(((pos % n) + n) % n); setTimeout(function () { dragged = false; }, 0); }
    });
    addEventListener("resize", function () { paint(false); });
    paint(false); show(0);
  }

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
    // Page 2: the story with the most stats leads on the left (or the one marked lead: true); the rest are tiles
    function score(it) { var t = 0; (it.stats || []).forEach(function (st) { t += parseInt(String(st.value).replace(/\D/g, ""), 10) || 0; }); return t; }
    var lead = null;
    rest.forEach(function (it) { if (it.lead) lead = it; });
    if (!lead) rest.forEach(function (it) { if (it.topic !== "other" && (!lead || score(it) > score(lead))) lead = it; });
    if (!lead) lead = rest[0];
    var tiles = rest.filter(function (it) { return it !== lead; });
    var restHtml = !rest.length ? "" : (
      '<div class="paper">' +
        '<div class="paper__rule reveal"><span>PAGE 2</span><b>More from the desk</b><span>' + rest.length + " STORIES</span></div>" +
        '<div class="paper__cols">' +
          '<a class="paper__lead reveal"' + topicAttr(lead.topic) + ' href="' + esc(lead.url) + '"' + ext(lead.url) + ">" +
            artImg(lead) +
            '<span class="mag__kicker">' + esc(lead.kicker || "") + (lead.pub ? " · " + esc(lead.pub) : "") + " · " + esc(lead.date || "") + "</span>" +
            '<span class="paper__h">' + esc(lead.title) + "</span>" +
            (lead.dek ? '<span class="mag__dek mag__dek--sm">' + esc(lead.dek) + "</span>" : "") +
            '<span class="paper__stats">' + (lead.stats || []).map(function (st) { return "<span><strong>" + esc(st.value) + "</strong>" + esc(st.label) + "</span>"; }).join("") +
              (lead.read ? "<span><strong>" + esc(lead.read.replace(/ ?min/, "")) + "</strong>min read</span>" : "") + "</span>" +
            '<span class="paper__go">Read the story ↗</span>' +
          "</a>" +
          '<div class="paper__tiles">' + tiles.map(function (it) {
            return '<a class="paper__tile reveal"' + topicAttr(it.topic) + ' href="' + esc(it.url) + '"' + ext(it.url) + ">" +
              '<span class="paper__txt"><span class="mag__kicker">' + esc(it.kicker || "") + " · " + esc(it.date || "") + "</span>" +
              '<span class="paper__th">' + esc(it.title) + "</span>" +
              (it.dek ? '<span class="paper__dek">' + esc(it.dek) + "</span>" : "") +
              '<span class="mag__stats">' + statLine(it) + (it.pub ? " · " + esc(it.pub) : "") + "</span></span>" +
              artImg(it) + "</a>";
          }).join("") + "</div>" +
        "</div>" +
      "</div>");
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
    featured = featured.slice(0, (v.reel && v.reel.max) || 5); // the puzzle is designed for 5 pieces
    var reel = featured.length ? (
      '<div class="reel">' +
      '<div class="section__head reveal"><p class="label">' + esc((v.reel || {}).label || "") + '</p><h3 class="h2">' + rich((v.reel || {}).title || "") + "</h3>" +
      '<p class="lead">' + esc((v.reel || {}).text || "Five talks, one puzzle. Pick up a piece to play it on the TV.") + "</p></div>" +
      '<div class="puzzle reveal" id="puzzle">' + featured.map(function (f, k) {
        return '<button type="button" class="pz reel__tile" data-ch="' + f.ci + '" data-i="' + f.ii + '" style="--h:' + ((k * 57) % 360) + '" aria-label="Play ' + esc(f.it.title) + '">' +
          '<span class="pz__clip">' + thumbImg(f.it, "pz__img") +
          '<span class="pz__fb" aria-hidden="true">' + esc(f.it.title) + "</span>" +
          '<span class="pz__meta"><span class="pz__title">' + esc(f.it.title) + "</span><span>" + esc(f.it.by || "") + " · " + esc(f.it.duration || "") + "</span></span>" +
          '<span class="pz__play" aria-hidden="true"></span>' +
          '<svg class="pz__line" aria-hidden="true"><path /></svg></span></button>';
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

  /* ---------- "Mic check" puzzle: pieces of different sizes that interlock ---------- */
  function initPuzzle() {
    var box = document.getElementById("puzzle");
    if (!box) return;
    var pieces = [].slice.call(box.querySelectorAll(".pz"));
    // layouts in grid units: [x, y, w, h]
    var WIDE = { cols: 12, unit: 0.075, rects: [[0, 0, 7, 4], [7, 0, 5, 2], [7, 2, 5, 2], [0, 4, 5, 2.4], [5, 4, 7, 2.4]] };
    var NARROW = { cols: 2, unit: 0.36, rects: [[0, 0, 2, 1.6], [0, 1.6, 1, 1.5], [1, 1.6, 1, 1.5], [0, 3.1, 1, 1.5], [1, 3.1, 1, 1.5]] };
    function plan(n, wide) {
      var L = wide ? WIDE : NARROW, out = L.rects.slice(0, n);
      while (out.length < n) { var last = out[out.length - 1]; out.push([0, last[1] + last[3], L.cols, wide ? 2 : 1.5]); }
      return { cols: L.cols, unit: L.unit, rects: out };
    }
    function draw() {
      var W = box.clientWidth; if (!W) return;
      var wide = W > 640, P = plan(pieces.length, wide);
      var cw = W / P.cols, ch = W * P.unit, K = wide ? 40 : 28;
      var r = K / 1.8, nk = r * 0.6;
      var R = P.rects.map(function (q) { return { x: q[0] * cw, y: q[1] * ch, w: q[2] * cw, h: q[3] * ch, tabs: { t: [], r: [], b: [], l: [] } }; });
      var H = 0; R.forEach(function (q) { H = Math.max(H, q.y + q.h); });
      box.style.height = H + "px";
      // tabs along every shared edge (one per ~280px); which side sticks out alternates
      function spots(lo, hi) { var m = Math.max(1, Math.floor((hi - lo) / 280)), out = []; for (var q = 0; q < m; q++) out.push(lo + (hi - lo) * (q + 0.5) / m); return out; }
      for (var i = 0; i < R.length; i++) for (var j = i + 1; j < R.length; j++) {
        var A = R[i], B = R[j], out = (i + j) % 2 === 0;
        [[A, B], [B, A]].forEach(function (pr, side) {
          var a = pr[0], b = pr[1];
          if (Math.abs(a.x + a.w - b.x) < 1) { // a's right edge touches b's left edge
            var lo = Math.max(a.y, b.y), hi = Math.min(a.y + a.h, b.y + b.h);
            if (hi - lo > 4 * r) spots(lo, hi).forEach(function (c, m) { var o = (side ? !out : out) !== !!(m % 2); a.tabs.r.push({ c: c - a.y, o: o }); b.tabs.l.push({ c: c - b.y, o: !o }); });
          }
          if (Math.abs(a.y + a.h - b.y) < 1) { // a's bottom touches b's top
            var lo2 = Math.max(a.x, b.x), hi2 = Math.min(a.x + a.w, b.x + b.w);
            if (hi2 - lo2 > 4 * r) spots(lo2, hi2).forEach(function (c, m) { var o = (side ? !out : out) !== !!(m % 2); a.tabs.b.push({ c: c - a.x, o: o }); b.tabs.t.push({ c: c - b.x, o: !o }); });
          }
        });
      }
      R.forEach(function (q, k) {
        var w = q.w, h = q.h, f = function (n) { return n.toFixed(1); };
        var d = "M" + f(K) + " " + f(K);
        q.tabs.t.sort(function (a, b) { return a.c - b.c; }).forEach(function (t) { d += "L" + f(K + t.c - nk) + " " + f(K) + "A" + f(r) + " " + f(r) + " 0 1 " + (t.o ? 1 : 0) + " " + f(K + t.c + nk) + " " + f(K); });
        d += "L" + f(K + w) + " " + f(K);
        q.tabs.r.sort(function (a, b) { return a.c - b.c; }).forEach(function (t) { d += "L" + f(K + w) + " " + f(K + t.c - nk) + "A" + f(r) + " " + f(r) + " 0 1 " + (t.o ? 1 : 0) + " " + f(K + w) + " " + f(K + t.c + nk); });
        d += "L" + f(K + w) + " " + f(K + h);
        q.tabs.b.sort(function (a, b) { return b.c - a.c; }).forEach(function (t) { d += "L" + f(K + t.c + nk) + " " + f(K + h) + "A" + f(r) + " " + f(r) + " 0 1 " + (t.o ? 1 : 0) + " " + f(K + t.c - nk) + " " + f(K + h); });
        d += "L" + f(K) + " " + f(K + h);
        q.tabs.l.sort(function (a, b) { return b.c - a.c; }).forEach(function (t) { d += "L" + f(K) + " " + f(K + t.c + nk) + "A" + f(r) + " " + f(r) + " 0 1 " + (t.o ? 1 : 0) + " " + f(K) + " " + f(K + t.c - nk); });
        d += "Z";
        var el = pieces[k], clip = el.firstChild;
        el.style.left = (q.x - K) + "px"; el.style.top = (q.y - K) + "px";
        el.style.width = (w + 2 * K) + "px"; el.style.height = (h + 2 * K) + "px"; el.style.setProperty("--k", K + "px");
        clip.style.clipPath = 'path("' + d + '")';
        clip.style.webkitClipPath = 'path("' + d + '")';
        var svg = el.querySelector(".pz__line");
        svg.setAttribute("viewBox", "0 0 " + (w + 2 * K) + " " + (h + 2 * K));
        svg.firstChild.setAttribute("d", d);
        el.classList.toggle("pz--big", w * h > 0.2 * W * H);
      });
    }
    draw();
    if ("ResizeObserver" in window) new ResizeObserver(draw).observe(box); else addEventListener("resize", draw);
  }

  /* ---------- Posts from X: notes pinned to a cork board ---------- */
  R.posts = function (x) {
    var items = x.items || [];
    if (!items.length) return "";
    var first = x.showFirst || items.length, extra = Math.max(0, items.length - first);
    var kinds = ["paper", "sticky", "index", "paper", "sticky"];
    return '<div class="wrap">' + head(x, x.text ? '<p class="lead">' + esc(x.text) + "</p>" : "") +
      '<div class="cork reveal fold">' +
        '<ul class="cork__board">' + items.map(function (t, k) {
          var url = t.url.replace("//twitter.com/", "//x.com/");
          var kind = t.pinned ? "pinned" : t.video ? "polaroid" : kinds[k % kinds.length];
          return '<li class="note note--' + kind + (k >= first ? " xtra" : "") + '" style="--r:' + (((k * 37) % 7) - 3) * 0.7 + 'deg">' +
            (t.pinned || k % 3 === 1 ? '<span class="note__tape" aria-hidden="true"></span>' : '<span class="note__pin" aria-hidden="true"></span>') +
            (t.pinned ? '<span class="note__flag">PINNED</span>' : "") +
            (t.video ? '<span class="note__shot" aria-hidden="true"><span>▶</span><small>VIDEO · ' + esc(t.video) + "</small></span>" : "") +
            '<p class="note__who"><b>' + esc(t.byName || x.name || "") + "</b> " + esc(t.by || x.handle || "") + "</p>" +
            (t.text ? '<p class="note__text">' + esc(t.text) + "</p>" : "") +
            '<p class="note__meta"><span>' + esc(t.date || "") + (t.likes ? " · ♥ " + esc(t.likes) : "") + "</span>" +
            '<a href="' + esc(url) + '" target="_blank" rel="noopener">Open on X ↗</a></p></li>';
        }).join("") + "</ul>" +
        (extra ? '<button type="button" class="more-btn more-btn--cork" data-more aria-expanded="false" data-label="Show ' + extra + ' more notes">Show ' + extra + " more notes</button>" : "") +
      "</div>" +
      (x.cta ? '<div class="more reveal"><a class="btn" href="' + esc(x.cta.href) + '"' + ext(x.cta.href) + ">" + esc(x.cta.label) + " ↗</a></div>" : "") +
      "</div>";
  };

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
      (S.skills && S.skills.groups ? '<div class="kit reveal fold"><p class="kit__label">Toolkit</p><div class="kit__groups">' +
        S.skills.groups.map(function (g) {
          return '<div class="kit__group"' + topicAttr(g.topic) + "><h3>" + esc(g.name) + '</h3><ul class="kit__chips">' +
            g.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
        }).join("") + "</div>" +
        '<button type="button" class="more-btn kit__more" data-more aria-expanded="false" data-label="Show the full toolkit">Show the full toolkit</button>' +
        // "Also at home in": folded behind a button (still in the page for Google & AI)
        (pb.alsoAt && pb.alsoAt.length ? '<div class="also2 fold">' +
          '<button type="button" class="more-btn also2__btn" data-more aria-expanded="false" data-label="Also at home in · ' + pb.alsoAt.length + ' more areas">Also at home in · ' + pb.alsoAt.length + " more areas</button>" +
          '<ul class="kit__also">' + pb.alsoAt.map(function (x) { return "<li><b>" + esc(x.title) + "</b> " + esc(x.text) + "</li>"; }).join("") + "</ul></div>" : "") +
        "</div>" : "") +
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
  initPuzzle();
  initRing();

  /* ---------- "Show more" buttons (the hidden items are in the page all along) ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-more]");
    if (!b) return;
    var box = b.closest(".fold");
    var open = box.classList.toggle("open");
    b.setAttribute("aria-expanded", open ? "true" : "false");
    b.textContent = open ? "Show less" : b.dataset.label;
  });

  /* ---------- menu: built from the sections, in page order ---------- */
  (function buildNav() {
    var nav = document.getElementById("navLinks");
    var page = document.body.getAttribute("data-page") || "";
    var cur = (S.pages || []).filter(function (x) { return x.id === page; })[0];
    nav.innerHTML = (S.menu || []).map(function (m) {
      var on = cur && m.href === cur.path;
      return '<a href="' + esc(m.href) + '"' + (on ? ' aria-current="page"' : "") + ">" + esc(m.label) + "</a>";
    }).join("");
  })();

  /* ---------- contact + footer ---------- */
  var c = S.contact;
  fill("contactLabel", esc(c.label));
  fill("contactTitle", rich(c.title));
  fill("contactText", esc(c.text));
  var doors = c.openTo || [];
  if (doors.length) {
    fill("doors", doors.map(function (d, k) {
      return '<button type="button" class="door door--' + k + '" data-door="' + esc(d.id) + '">' +
        '<span class="door__title">' + esc(d.title) + "</span>" +
        '<span class="door__text">' + esc(d.text) + "</span>" +
        (d.meta ? '<span class="door__meta">' + esc(d.meta) + "</span>" : "") +
        '<span class="door__cta">' + esc(d.cta || "Get in touch") + " →</span></button>";
    }).join(""));
    fill("reason", '<legend><span>I\'m writing about</span></legend><div class="reason__opts">' +
      doors.map(function (d) { return '<label><input type="radio" name="reason" value="' + esc(d.title) + '" data-door="' + esc(d.id) + '" /><span>' + esc(d.chip || d.title) + "</span></label>"; }).join("") +
      '<label><input type="radio" name="reason" value="Something else" /><span>Something else</span></label></div>');
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button[data-door]"); if (!b) return;
      var r = document.querySelector('input[name="reason"][data-door="' + b.dataset.door + '"]');
      if (r) r.checked = true;
      var f = document.getElementById("contactForm");
      f.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      setTimeout(function () { document.getElementById("name").focus({ preventScroll: true }); }, 400);
    });
  } else { var rs = document.querySelector('[data-fill="reason"]'); if (rs) rs.remove(); var ds = document.querySelector('[data-fill="doors"]'); if (ds) ds.remove(); }
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
    var formEl = document.getElementById("contactForm"), overForm = false;
    if (formEl && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { overForm = en[0].isIntersecting; onScroll(); }, { rootMargin: "0px 0px -60px 0px" }).observe(formEl.querySelector("button[type=submit]"));
    }
    var onScroll = function () { toTop.classList.toggle("show", scrollY > 600 && !overForm); };
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
