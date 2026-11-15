// Mobile menu, scrollspy, back-to-top, photo lightbox, print CV, footer year, scroll reveal.
(function () {
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.links');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Save CV as PDF: the print stylesheet turns the page into a clean CV.
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });

  // Back to top
  var top = document.querySelector('.to-top');
  if (top) {
    var onScroll = function () { top.classList.toggle('show', window.scrollY > 700); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Scrollspy: highlight the nav and sub-nav link for the section in view.
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.links a[href^="#"], .subnav a[href^="#"]'));
  var spyTargets = spyLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && spyTargets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id;
        var isSub = /^#(edu|es)-/.test(id);
        spyLinks.forEach(function (a) {
          var inSub = !!a.closest('.subnav');
          if (inSub === isSub) a.classList.toggle('active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }

  // Lightbox for achievement photos: view the local copy, with a link to the original.
  var shots = document.querySelectorAll('.thumbs a, a.ach-main');
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><img alt=""><div class="lb-bar"><span class="lb-cap"></span><a target="_blank" rel="noopener">Open original</a></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap'), lbLink = lb.querySelector('a');
    var close = function () { lb.classList.remove('open'); document.body.style.overflow = ''; };
    shots.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var img = a.querySelector('img');
        if (!img) return;
        e.preventDefault();
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = img.alt;
        lbLink.href = a.href;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.lb-close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Scroll reveal
  var targets = document.querySelectorAll('.sec .wrap > *, .ach, .block, .track-head');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
