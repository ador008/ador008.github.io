// Theme, menu, pop-ups, tabs, print CV and the depth carousel.
(function () {
  var root = document.documentElement;

  // ---------- Theme (dark by default, remembered per browser) ----------
  document.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  // ---------- Mobile menu (slide-over with backdrop) ----------
  var toggle = document.querySelector('.nav-toggle'), drawer = document.getElementById('drawer');
  var backdrop = document.querySelector('.nav-backdrop');
  function setMenu(open) {
    if (!toggle || !drawer) return;
    drawer.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (backdrop) backdrop.hidden = !open;
  }
  if (toggle && drawer) {
    toggle.addEventListener('click', function () { setMenu(!drawer.classList.contains('open')); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a,button')) setMenu(false); });
    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // ---------- 3D tilt with glare (mouse only, not with reduced motion) ----------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      var g = document.createElement('span'); g.className = 'glare'; g.setAttribute('aria-hidden', 'true'); card.appendChild(g);
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((x - 0.5) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        card.classList.add('tilting');
      });
      card.addEventListener('pointerleave', function () { card.classList.remove('tilting'); });
    });
  }

  // ---------- Pop-ups ----------
  var lastFocus = null;
  // Scrolling is frozen while a pop-up or the "View all" grid is open, and only unfrozen when none is left open.
  function lock(on) {
    if (on) { document.body.style.overflow = 'hidden'; return; }
    if (!document.querySelector('.modal.open, .flood.open')) document.body.style.overflow = '';
  }
  // Close every pop-up and "View all" grid and turn scrolling back on.
  function closeAllOverlays() {
    document.querySelectorAll('.modal.open, .flood.open').forEach(function (m) { m.classList.remove('open'); });
    document.body.style.overflow = '';
  }
  // Leaving the page, coming back with the browser's Back button, or switching tab must never leave scrolling frozen.
  window.addEventListener('pagehide', closeAllOverlays);
  window.addEventListener('pageshow', closeAllOverlays);
  document.addEventListener('tabshown', closeAllOverlays);
  window.addEventListener('hashchange', closeAllOverlays);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && !a.target && a.getAttribute('href').charAt(0) !== '#' && a.href.indexOf('mailto:') !== 0) closeAllOverlays();
  });
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open'); lock(true);
    var x = m.querySelector('[data-close]'); if (x) x.focus();
  }
  function closeModals() {
    var any = document.querySelector('.modal.open');
    document.querySelectorAll('.modal.open').forEach(function (m) { m.classList.remove('open'); });
    if (any) { lock(false); if (lastFocus) lastFocus.focus(); }
  }
  // Email pop-up, opened by the floating "Email me" button. Built here so every page gets it.
  var EMAIL = 'ador8210@gmail.com';
  var fab = document.querySelector('.mail-fab');
  if (fab && !document.getElementById('email')) {
    var em = document.createElement('div');
    em.className = 'modal'; em.id = 'email';
    em.setAttribute('role', 'dialog'); em.setAttribute('aria-modal', 'true'); em.setAttribute('aria-labelledby', 'email-t');
    var mailIcon = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>';
    em.innerHTML = '<div class="sheet email-sheet">' +
      '<button class="key icon x" type="button" data-close aria-label="Close"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>' +
      '<h2 id="email-t">Email me</h2><p>Questions, opportunities or collaborations: write to me here.</p>' +
      '<div class="email-addr"><span class="ib">' + mailIcon + '</span><b>' + EMAIL + '</b><button class="key" type="button" data-copy-email>Copy</button></div>' +
      '<div class="btn-row email-actions">' +
        '<a class="key primary lg" href="mailto:' + EMAIL + '">' + mailIcon + 'Open email app</a>' +
        '<a class="key lg" href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=' + EMAIL + '" target="_blank" rel="noopener">Write in Gmail</a>' +
      '</div><p class="email-note" aria-live="polite"></p></div>';
    document.body.appendChild(em);
    fab.addEventListener('click', function (e) { e.preventDefault(); openModal('email'); });
    // Inside a frame (like the claude.ai preview) a plain mailto link is blocked, so open it in a new window there.
    var inFrame = false; try { inFrame = window.self !== window.top; } catch (err) { inFrame = true; }
    if (inFrame) em.querySelectorAll('a[href^="mailto:"]').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener'; });
    var copyBtn = em.querySelector('[data-copy-email]'), note = em.querySelector('.email-note');
    copyBtn.addEventListener('click', function () {
      function done() { copyBtn.textContent = 'Copied!'; note.textContent = 'Email address copied.'; setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(em.querySelector('.email-addr b'));
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { if (document.execCommand('copy')) { done(); return; } } catch (err) {}
        note.textContent = 'Address selected: press copy on your keyboard or phone.';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(done, fallback); else fallback();
    });
  }
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { openModal(b.getAttribute('data-open')); });
  });
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) closeModals(); });
  });
  if (location.hash === '#contact' || location.hash === '#about') openModal(location.hash.slice(1));

  // ---------- Pill tabs (each tab has its own #link) ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function showTab(id, write) {
    var tab = tabs.filter(function (t) { return t.getAttribute('aria-controls') === id; })[0] || tabs[0];
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.classList.toggle('active', on);
    });
    if (write && history.replaceState) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    document.dispatchEvent(new CustomEvent('tabshown', { detail: tab.getAttribute('aria-controls') }));
  }
  if (tabs.length) {
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { showTab(t.getAttribute('aria-controls'), true); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); showTab(n.getAttribute('aria-controls'), true);
      });
    });
    showTab(location.hash.slice(1), false);
    window.addEventListener('hashchange', function () { showTab(location.hash.slice(1), false); });
  }

  // ---------- Save CV as PDF ----------
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.add('active'); });
      var oldTitle = document.title; document.title = 'Ador Chowdhury CV';
      window.print();
      document.title = oldTitle;
      showTab(location.hash.slice(1), false);
    });
  });

  // ---------- Year-by-year story (one year at a time) ----------
  document.querySelectorAll('[data-years]').forEach(function (root) {
    var btns = Array.prototype.slice.call(root.querySelectorAll('[data-year]'));
    var chapters = root.querySelectorAll('[data-chapter]');
    var cur = 0;
    function show(i) {
      cur = Math.max(0, Math.min(btns.length - 1, i));
      var y = btns[cur].getAttribute('data-year');
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); });
      chapters.forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-chapter') === y); });
      btns[cur].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    root.querySelectorAll('[data-year-step]').forEach(function (b) {
      b.addEventListener('click', function () { show(cur + parseInt(b.getAttribute('data-year-step'), 10)); });
    });
  });

  // ---------- Zoom inside the photo viewers ----------
  // Mouse: scroll to zoom, double-click to zoom in or out, drag to move around.
  // Touch: pinch to zoom, double-tap to zoom in or out, drag with one finger to move around.
  function zoomViewer(box) {
    var img = box.querySelector('img');
    var z = 1, x = 0, y = 0, MAX = 5;
    var pts = {}, startDist = 0, startZ = 1, lastTap = 0, tapToggled = 0, panFrom = null;
    function clamp() {
      var w = box.clientWidth, h = box.clientHeight;
      var iw = img.naturalWidth || w, ih = img.naturalHeight || h, f = Math.min(w / iw, h / ih);
      var mx = Math.max(0, (iw * f * z - w) / 2), my = Math.max(0, (ih * f * z - h) / 2);   // stop at the photo's edges
      x = Math.max(-mx, Math.min(mx, x)); y = Math.max(-my, Math.min(my, y));
    }
    function apply(smooth) {
      if (z <= 1.001) { z = 1; x = 0; y = 0; }
      clamp();
      img.style.transition = smooth ? 'transform .25s ease' : 'none';
      img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + z + ')';
      box.classList.toggle('zoomed', z > 1);
    }
    // zoom to "nz", keeping the point under (cx, cy) in place
    function zoomAt(nz, cx, cy, smooth) {
      nz = Math.max(1, Math.min(MAX, nz));
      var r = box.getBoundingClientRect();
      var px = cx - r.left - r.width / 2, py = cy - r.top - r.height / 2;
      x = px - (px - x) * nz / z; y = py - (py - y) * nz / z; z = nz;
      apply(smooth);
    }
    function toggle(cx, cy) { if (z > 1) { z = 1; apply(true); } else zoomAt(2.5, cx, cy, true); }
    box.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomAt(z * Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0018)), e.clientX, e.clientY, false);
    }, { passive: false });
    box.addEventListener('dblclick', function (e) {
      e.preventDefault();
      if (performance.now() - tapToggled < 600) return;      // a double-tap already did it (phones fire both)
      toggle(e.clientX, e.clientY);
    });
    box.addEventListener('pointerdown', function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      box.setPointerCapture(e.pointerId);
      var ids = Object.keys(pts);
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        startDist = Math.hypot(a.x - b.x, a.y - b.y); startZ = z; panFrom = null;
      } else if (ids.length === 1) {
        panFrom = { x: e.clientX - x, y: e.clientY - y };
        if (e.pointerType !== 'mouse') {                       // double-tap on touch screens
          var now = performance.now();
          if (now - lastTap < 300) { toggle(e.clientX, e.clientY); tapToggled = now; lastTap = 0; panFrom = null; } else lastTap = now;
        }
      }
    });
    box.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 2 && startDist) {
        var a = pts[ids[0]], b = pts[ids[1]];
        zoomAt(startZ * Math.hypot(a.x - b.x, a.y - b.y) / startDist, (a.x + b.x) / 2, (a.y + b.y) / 2, false);
      } else if (ids.length === 1 && panFrom && z > 1) {
        x = e.clientX - panFrom.x; y = e.clientY - panFrom.y; apply(false);
      }
    });
    function up(e) {
      delete pts[e.pointerId];
      var ids = Object.keys(pts);
      if (ids.length < 2) startDist = 0;
      if (ids.length === 1) { var p = pts[ids[0]]; panFrom = { x: p.x - x, y: p.y - y }; }
    }
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    return function reset() { z = 1; x = 0; y = 0; pts = {}; apply(false); };
  }
  var VIEWER = '<div class="zoom-box"><img alt="" draggable="false"></div><p class="zoom-hint">Scroll or double-click to zoom. On a phone, pinch or double-tap.</p><p class="zoom-cap"></p>';

  // ---------- Photo zoom for story pictures ----------
  var zoomers = document.querySelectorAll('[data-zoom]');
  if (zoomers.length) {
    var zb = document.createElement('div');
    zb.className = 'modal';
    zb.setAttribute('role', 'dialog');
    zb.setAttribute('aria-modal', 'true');
    zb.innerHTML = '<div class="sheet" style="width:min(1000px,100%);padding:16px"><button class="key icon x" type="button" data-close aria-label="Close" style="z-index:2">✕</button>' + VIEWER + '</div>';
    document.body.appendChild(zb);
    var zbReset = zoomViewer(zb.querySelector('.zoom-box'));
    zb.addEventListener('click', function (e) { if (e.target === zb || e.target.closest('[data-close]')) { zb.classList.remove('open'); lock(false); } });
    zoomers.forEach(function (b) {
      b.addEventListener('click', function () {
        var im = b.querySelector('img');
        zb.querySelector('img').src = b.getAttribute('data-zoom');
        zb.querySelector('img').alt = im ? im.alt : '';
        zb.querySelector('.zoom-cap').textContent = im ? im.alt : '';
        zbReset(); zb.classList.add('open'); lock(true);
      });
    });
  }

  // ---------- Depth carousel ----------
  document.querySelectorAll('[data-look]').forEach(initLook);

  function initLook(look) {
    var stage = look.querySelector('.stage');
    var slides = Array.prototype.slice.call(stage.querySelectorAll('.slide'));
    var n = slides.length;
    if (!n) return;
    var range = look.querySelector('.range'), ticks = look.querySelector('.ticks');
    var count = look.querySelector('.count'), body = look.querySelector('.look-body');
    var cursor = stage.querySelector('.view-cursor');
    var section = look.closest('.panel') || document;
    var flood = section.querySelector('.flood'), grid = section.querySelector('.flood-grid');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;

    var pos = 0, current = -1, anim = null;
    var mod = function (a, m) { return ((a % m) + m) % m; };

    section.querySelectorAll('[data-total]').forEach(function (el) { el.textContent = n; });
    range.max = n - 1;
    for (var t = 0; t < (n - 1) * 3 + 1; t++) ticks.appendChild(document.createElement('span'));

    function spacing() { return window.innerWidth < 720 ? 0.62 : 0.56; }

    function render() {
      var sp = spacing();
      slides.forEach(function (s, i) {
        var d = mod(i - pos + n / 2, n) - n / 2;
        var ad = Math.abs(d);
        if (ad > 2.6) { s.style.visibility = 'hidden'; return; }
        s.style.visibility = 'visible';
        var c = Math.min(ad, 2.5);
        s.style.transform = 'translate(-50%,-50%) translateX(' + (d * sp * 100) + '%) scale(' + (1 - 0.2 * c) + ')';
        s.style.opacity = Math.max(0, 1 - 0.32 * c);
        s.style.filter = reduce ? 'none' : 'blur(' + (c * 3.5).toFixed(2) + 'px)';
        s.style.zIndex = String(100 - Math.round(ad * 10));
      });
      var idx = mod(Math.round(pos), n);
      if (idx !== current) { current = idx; updatePanel(); }
    }

    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function updatePanel() {
      var s = slides[current].dataset;
      count.textContent = (current + 1) + ' / ' + n;
      range.value = current;
      body.innerHTML =
        '<div class="fade-swap">' +
        '<ul class="chips"><li>' + esc(s.tag) + '</li><li>' + esc(s.date) + '</li></ul>' +
        '<h3 style="margin-top:12px">' + esc(s.title) + '</h3>' +
        '<p class="tagline">' + esc(s.event) + '</p>' +
        '<p>' + esc(s.note) + '</p>' +
        (s.href ? '<a class="link" href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.link) + '</a>' : '') +
        '</div>';
      slides.forEach(function (sl, i) { sl.setAttribute('aria-hidden', i === current ? 'false' : 'true'); });
    }

    function animateTo(target, dur) {
      if (anim) cancelAnimationFrame(anim);
      var from = pos, start = performance.now();
      dur = reduce ? 1 : (dur || 450);
      (function step(now) {
        var k = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        pos = from + (target - from) * e;
        render();
        if (k < 1) anim = requestAnimationFrame(step); else { anim = null; pos = mod(Math.round(target), n); render(); }
      })(start);
    }
    function goTo(i) {
      var delta = mod(i - pos + n / 2, n) - n / 2;
      animateTo(pos + delta);
    }
    function step(d) { goTo(Math.round(pos) + d); }

    // Drag / swipe
    var dragging = false, moved = 0, startX = 0, startPos = 0, lastX = 0, lastT = 0, vel = 0;
    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (anim) { cancelAnimationFrame(anim); anim = null; }
      dragging = true; moved = 0; startX = lastX = e.clientX; startPos = pos; lastT = performance.now(); vel = 0;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('dragging');
    });
    stage.addEventListener('pointermove', function (e) {
      if (finePointer && cursor) moveCursor(e);
      if (!dragging) return;
      var w = slides[0].offsetWidth * spacing();
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      pos = startPos - dx / w;
      var now = performance.now();
      if (now > lastT) { vel = (e.clientX - lastX) / w / (now - lastT) * 1000; lastX = e.clientX; lastT = now; }
      render();
    });
    function release(e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('dragging');
      if (moved < 6) {
        var hit = document.elementFromPoint(e.clientX, e.clientY);
        var s = hit && hit.closest ? hit.closest('.slide') : null;
        var i = slides.indexOf(s);
        if (i >= 0 && i !== current) { goTo(i); return; }
        if (i === current) { openLightbox(current); }
        animateTo(Math.round(pos), 200);
        return;
      }
      var throwTo = Math.round(pos - Math.max(-3, Math.min(3, vel * 0.25)));
      animateTo(throwTo);
    }
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);

    // "VIEW" cursor over the centre photo (mouse only)
    function moveCursor(e) {
      var r = stage.getBoundingClientRect();
      var hit = document.elementFromPoint(e.clientX, e.clientY);
      var s = hit && hit.closest ? hit.closest('.slide') : null;
      var show = !dragging && s && slides.indexOf(s) === current;
      cursor.hidden = !show;
      stage.style.cursor = show ? 'pointer' : '';
      // Keep the real mouse visible; the small VIEW label sits just below-right of it.
      if (show) cursor.style.transform = 'translate(' + (e.clientX - r.left + 16) + 'px,' + (e.clientY - r.top + 18) + 'px)';
    }
    stage.addEventListener('pointerleave', function () { if (cursor) cursor.hidden = true; stage.style.cursor = ''; });

    // Keyboard, buttons, scrubber
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'Enter') openLightbox(current);
    });
    var prev = look.querySelector('[data-prev]'), next = look.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    range.addEventListener('input', function () { goTo(parseInt(range.value, 10)); });
    window.addEventListener('resize', render);

    // View all grid
    var viewAll = look.querySelector('[data-viewall]');
    if (flood && grid && viewAll) {
      // Move the grid to <body> so it always sits above the header (inside <main> it was layered underneath it).
      document.body.appendChild(flood);
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = '<img src="' + s.querySelector('img').getAttribute('src') + '" alt="" loading="lazy"><span>' + esc(s.dataset.title) + '</span>';
        b.addEventListener('click', function () { closeFlood(); pos = i; current = -1; render(); stage.focus(); });
        grid.appendChild(b);
      });
      // Section bar inside "View all": jump to Story, Achievements and so on without pressing X first.
      // On the Esports page it switches tabs; on a team page it links to that section of the Esports page.
      var head = flood.querySelector('.flood-head');
      if (head && !flood.querySelector('.flood-nav')) {
        var nav = document.createElement('nav');
        nav.className = 'flood-nav';
        nav.setAttribute('aria-label', 'Go to another section');
        var pageTabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
        var items = pageTabs.length ? pageTabs.map(function (t) { return [t.getAttribute('aria-controls'), t.textContent.trim()]; })
          : [['highlights', 'Highlights'], ['story', 'Story'], ['achievements', 'Achievements'], ['teams', 'Teams'], ['organizer', 'As an Organizer'], ['skills', 'Skills']];
        var here = section.id || 'highlights';
        items.forEach(function (it) {
          var el;
          if (pageTabs.length) {
            el = document.createElement('button'); el.type = 'button';
            el.addEventListener('click', function () {
              closeFlood(); showTab(it[0], true);
              var bar = document.querySelector('.pills'); if (bar) bar.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
            });
          } else {
            el = document.createElement('a'); el.href = 'esports.html#' + it[0];
          }
          el.className = 'fn-pill';
          if (pageTabs.length && it[0] === here) el.setAttribute('aria-current', 'true');
          el.textContent = it[1];
          nav.appendChild(el);
        });
        head.insertAdjacentElement('afterend', nav);
      }
      viewAll.addEventListener('click', function () { flood.classList.add('open'); lock(true); });
      flood.addEventListener('click', function (e) { if (e.target.closest('[data-close-flood]')) closeFlood(); });
    }
    function closeFlood() { if (flood) { flood.classList.remove('open'); lock(false); } }

    // Large view of the centre photo
    var lb = document.createElement('div');
    lb.className = 'modal';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<div class="sheet" style="width:min(1000px,100%);padding:16px"><button class="key icon x" type="button" data-close aria-label="Close" style="z-index:2">✕</button>' + VIEWER + '</div>';
    document.body.appendChild(lb);
    var lbReset = zoomViewer(lb.querySelector('.zoom-box'));
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('[data-close]')) { lb.classList.remove('open'); lock(false); } });
    function openLightbox(i) {
      var s = slides[i], img = s.querySelector('img');
      lb.querySelector('img').src = img.src;
      lb.querySelector('img').alt = img.alt;
      lb.querySelector('.zoom-cap').textContent = s.dataset.title + ' · ' + s.dataset.event;
      lbReset(); lb.classList.add('open'); lock(true);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeFlood(); if (lb.classList.contains('open')) { lb.classList.remove('open'); lock(false); } }
    });
    document.addEventListener('tabshown', render);
    render();
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
