/* designwithv.ca — small, dependency-free interactions.
   Everything here is progressive: the site reads fine with JavaScript off,
   and all motion is skipped when the visitor prefers reduced motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.nav');

  /* Nav: blurred bar after scrolling, plus reading progress on the case study */
  var progress = document.querySelector('.progress');
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      });
    });
  }

  /* Hero headline: split into words so they can rise in one by one */
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'word';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero').forEach(function (h) { h.classList.add('loaded'); });
    });
  });

  /* Stagger children of [data-stagger] */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
    Array.prototype.forEach.call(group.querySelectorAll(':scope > [data-reveal]'), function (el, i) {
      el.style.setProperty('--d', i * step + 'ms');
    });
  });

  /* Count-up numbers */
  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (reduce || isNaN(to)) return;
    var start = null, dur = 1100;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(to * eased).toLocaleString('en-CA') + suf;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Lightbox: any element with data-zoom opens its image full screen */
  var box = document.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    var boxImg = box.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        boxImg.src = btn.getAttribute('data-zoom');
        boxImg.alt = btn.getAttribute('data-alt') || '';
        box.showModal();
      });
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.lightbox-close')) box.close();
    });
    box.addEventListener('close', function () { boxImg.removeAttribute('src'); });
  } else {
    /* Older browsers: fall back to opening the image itself */
    document.querySelectorAll('[data-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.open(btn.getAttribute('data-zoom'), '_blank'); });
    });
  }

  /* Interactive sitemap: "View as" switch */
  var sm = document.getElementById('sitemap');
  if (sm) {
    var info = {
      g: { name: 'General', who: 'Core frontline teams' },
      s: { name: 'Specialized', who: 'Domain-specific teams' },
      a: { name: 'Advanced', who: 'Expert teams handling exceptions and escalations' }
    };
    var rank = { g: 0, s: 1, a: 2 };
    var status = sm.querySelector('.sm-status');
    var total = sm.querySelectorAll('.pg').length;
    var setView = function (lv) {
      sm.setAttribute('data-view', lv);
      sm.querySelectorAll('.sm-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-level') === lv ? 'true' : 'false');
      });
      var seen = 0;
      sm.querySelectorAll('.pg').forEach(function (pg) {
        var own = pg.classList.contains('pg-a') ? 'a' : pg.classList.contains('pg-s') ? 's' : 'g';
        if (rank[own] <= rank[lv]) seen++;
      });
      status.innerHTML = '<strong>' + info[lv].name + ' access</strong> <span class="muted">· ' + info[lv].who + ' · sees ' + seen + ' of ' + total + ' pages</span>';
    };
    sm.querySelectorAll('.sm-btn').forEach(function (b) {
      b.addEventListener('click', function () { setView(b.getAttribute('data-level')); });
    });
    setView('g');
  }


  /* Tabs (case study): arrow keys move between tabs; with JS off all panels show */
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    wrap.classList.add('is-ready');
    select(tabs[0], false);
  });

  /* Accordions: expand / collapse all, and open a section when a link points to it */
  var accs = document.querySelectorAll('details.acc');
  var allBtn = document.querySelector('[data-expand-all]');
  function syncAllBtn() {
    if (!allBtn) return;
    var allOpen = Array.prototype.every.call(accs, function (d) { return d.open; });
    allBtn.textContent = allOpen ? 'Collapse all' : 'Expand all';
    allBtn.setAttribute('aria-pressed', allOpen ? 'true' : 'false');
  }
  if (allBtn) {
    allBtn.addEventListener('click', function () {
      var open = allBtn.getAttribute('aria-pressed') !== 'true';
      accs.forEach(function (d) { d.open = open; });
      syncAllBtn();
    });
    accs.forEach(function (d) { d.addEventListener('toggle', syncAllBtn); });
    syncAllBtn();
  }
  function openFromHash(hash) {
    if (!hash || hash.length < 2) return;
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el && el.tagName === 'DETAILS') { el.open = true; }
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { openFromHash(a.getAttribute('href')); });
  });
  openFromHash(window.location.hash);
  window.addEventListener('hashchange', function () { openFromHash(window.location.hash); });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
