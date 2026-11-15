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

  // ---------- Mobile menu ----------
  var toggle = document.querySelector('.nav-toggle'), drawer = document.getElementById('drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) { drawer.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---------- Pop-ups ----------
  var lastFocus = null;
  function lock(on) { document.body.style.overflow = on ? 'hidden' : ''; }
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
      window.print();
      showTab(location.hash.slice(1), false);
    });
  });

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
        '<a class="link" href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.link) + ' ↗</a>' +
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
      stage.style.cursor = show ? 'none' : '';
      if (show) cursor.style.transform = 'translate(' + (e.clientX - r.left - 37) + 'px,' + (e.clientY - r.top - 37) + 'px)';
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
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = '<img src="' + s.querySelector('img').getAttribute('src') + '" alt="" loading="lazy"><span>' + esc(s.dataset.title) + '</span>';
        b.addEventListener('click', function () { closeFlood(); pos = i; current = -1; render(); stage.focus(); });
        grid.appendChild(b);
      });
      viewAll.addEventListener('click', function () { flood.classList.add('open'); lock(true); });
      flood.addEventListener('click', function (e) { if (e.target.closest('[data-close-flood]')) closeFlood(); });
    }
    function closeFlood() { if (flood) { flood.classList.remove('open'); lock(false); } }

    // Large view of the centre photo
    var lb = document.createElement('div');
    lb.className = 'modal';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<div class="sheet" style="width:min(1000px,100%);padding:16px"><button class="key icon x" type="button" data-close aria-label="Close" style="z-index:2">✕</button><img alt="" style="width:100%;max-height:72vh;object-fit:contain;border-radius:12px;background:#000"><p style="margin:12px 4px 0;color:var(--text);font-weight:600"></p></div>';
    document.body.appendChild(lb);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('[data-close]')) { lb.classList.remove('open'); lock(false); } });
    function openLightbox(i) {
      var s = slides[i], img = s.querySelector('img');
      lb.querySelector('img').src = img.src;
      lb.querySelector('img').alt = img.alt;
      lb.querySelector('p').textContent = s.dataset.title + ' · ' + s.dataset.event;
      lb.classList.add('open'); lock(true);
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
