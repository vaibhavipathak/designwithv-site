/* Interactive scenario: "Check the AI summary" (brightline-demo.html).
   Plain JavaScript, no libraries. Mirrors the Storyline build:
   slides, feedback "layers", a Score variable and a FirstTry flag. */
(function () {
  var player = document.querySelector('[data-scenario]');
  if (!player) return;

  var slides = player.querySelectorAll('[data-slide]');
  var scoreEl = player.querySelector('[data-score]');
  var stepEl = player.querySelector('[data-step-label]');
  var bar = player.querySelector('[data-progress]');
  var state = { slide: 1, score: 0, firstTry: true, d2: null };
  var TOTAL = 5;

  var scoring = {
    'd1-edit': function () { if (state.firstTry) state.score += 10; },
    'd1-send': function () { state.firstTry = false; },
    'd1-reject': function () { state.firstTry = false; },
    'd2-a': function () { state.d2 = 'a'; },
    'd2-b': function () { state.d2 = 'b'; state.score += 10; },
    'd2-c': function () { state.d2 = 'c'; }
  };

  function current() { return player.querySelector('[data-slide="' + state.slide + '"]'); }

  function setChoicesLocked(slide, locked) {
    slide.querySelectorAll('[data-choice]').forEach(function (b) {
      b.disabled = locked;
      if (!locked) b.removeAttribute('aria-pressed');
    });
  }

  function hideFeedback(slide) {
    slide.querySelectorAll('[data-fb]').forEach(function (f) { f.hidden = true; });
  }

  function updateBar() {
    scoreEl.textContent = state.score;
    stepEl.textContent = 'Step ' + state.slide + ' of ' + TOTAL;
    bar.style.width = (state.slide / TOTAL * 100) + '%';
  }

  function show(n) {
    state.slide = n;
    slides.forEach(function (s) {
      var on = s.getAttribute('data-slide') === String(n);
      s.hidden = !on;
      if (on) { hideFeedback(s); setChoicesLocked(s, false); }
    });
    if (n === 3) {
      var blank = player.querySelector('[data-amount]');
      blank.innerHTML = '$<span class="sr-only">amount to fix</span>??.??';
      blank.classList.remove('fixed');
    }
    if (n === 5) showResult();
    updateBar();
    var title = current().querySelector('.slide-title');
    if (title) title.focus({ preventScroll: true });
    var top = player.getBoundingClientRect().top + window.scrollY - 96;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function showResult() {
    var pass = state.score === 20;
    player.querySelector('[data-result="pass"]').hidden = !pass;
    player.querySelector('[data-result="retry"]').hidden = pass;
    player.querySelectorAll('[data-score-text]').forEach(function (el) { el.textContent = state.score; });
    var tip = player.querySelector('[data-retry-tip]');
    if (!pass && tip) {
      var missedFirst = !state.firstTry;
      var missedEmail = state.d2 !== 'b';
      tip.textContent = missedFirst && missedEmail
        ? 'Try the call once more: numbers first, then tone.'
        : missedFirst
          ? 'You got there, but not on the first try. Check the numbers before you choose.'
          : 'Your summary fix was spot on. This time, pick the email that is kind, accurate and promises nothing extra.';
    }
  }

  function restart() {
    state.score = 0; state.firstTry = true; state.d2 = null;
    show(2);
  }

  player.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !player.contains(btn)) return;
    var slide = current();

    if (btn.hasAttribute('data-choice')) {
      var id = btn.getAttribute('data-choice');
      if (scoring[id]) scoring[id]();
      if (id === 'd1b-54') {
        var blank = player.querySelector('[data-amount]');
        blank.textContent = '$54.00';
        blank.classList.add('fixed');
      }
      setChoicesLocked(slide, true);
      btn.setAttribute('aria-pressed', 'true');
      hideFeedback(slide);
      var fb = slide.querySelector('[data-fb="' + id + '"]');
      if (fb) {
        fb.hidden = false;
        var v = fb.querySelector('.fb-verdict');
        if (v) v.focus({ preventScroll: true });
        fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      updateBar();
      return;
    }
    if (btn.hasAttribute('data-retry')) {
      hideFeedback(slide);
      setChoicesLocked(slide, false);
      var first = slide.querySelector('[data-choice]');
      if (first) first.focus();
      return;
    }
    if (btn.hasAttribute('data-go')) { show(parseInt(btn.getAttribute('data-go'), 10)); return; }
    if (btn.hasAttribute('data-restart')) { restart(); }
  });

  player.classList.add('is-ready');
  updateBar();
})();
