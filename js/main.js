// Tabs, pop-ups, photo filter, lightbox, print CV, footer year.
(function () {
  // ---------- Pop-ups (About, Contact) ----------
  var lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    var x = m.querySelector('[data-close]');
    if (x) x.focus();
  }
  function closeModals() {
    document.querySelectorAll('.modal.open').forEach(function (m) { m.classList.remove('open'); });
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { openModal(b.getAttribute('data-open')); });
  });
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.closest('[data-close]')) closeModals();
    });
  });

  // ---------- Tabs (with #hash so each tab has its own link) ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function showTab(id, push) {
    var tab = tabs.filter(function (t) { return t.getAttribute('aria-controls') === id; })[0];
    if (!tab) { tab = tabs[0]; id = tab.getAttribute('aria-controls'); }
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.classList.toggle('active', on);
    });
    if (push && history.replaceState) history.replaceState(null, '', '#' + id);
  }
  if (tabs.length) {
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { showTab(t.getAttribute('aria-controls'), true); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus();
        showTab(n.getAttribute('aria-controls'), true);
      });
    });
    document.querySelectorAll('[data-tab]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); showTab(a.getAttribute('data-tab'), true); });
    });
    showTab(location.hash.slice(1), false);
    window.addEventListener('hashchange', function () { showTab(location.hash.slice(1), false); });
  }

  // ---------- Photo filter ----------
  document.querySelectorAll('.filter').forEach(function (f) {
    f.addEventListener('click', function () {
      var g = f.getAttribute('data-filter');
      document.querySelectorAll('.filter').forEach(function (o) { o.classList.toggle('on', o === f); });
      document.querySelectorAll('.grid a').forEach(function (a) {
        a.classList.toggle('hide', g !== 'all' && a.getAttribute('data-group') !== g);
      });
    });
  });

  // ---------- Lightbox ----------
  var shots = document.querySelectorAll('.grid a');
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="x" aria-label="Close" style="position:absolute;top:18px;right:18px">&times;</button><img alt=""><div class="lb-bar"><span class="lb-cap"></span><a target="_blank" rel="noopener">Open original</a></div>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap'), link = lb.querySelector('a');
    shots.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var i = a.querySelector('img');
        e.preventDefault();
        img.src = i.src; img.alt = i.alt; cap.textContent = i.alt; link.href = a.href;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('.x')) { lb.classList.remove('open'); document.body.style.overflow = ''; }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeModals();
    var l = document.querySelector('.lb.open');
    if (l) { l.classList.remove('open'); document.body.style.overflow = ''; }
  });

  // ---------- Save CV as PDF ----------
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });

  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
