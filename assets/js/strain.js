/* =========================================================================
   The hold demo.

   The site's whole argument is "you understand the game in three seconds",
   so the page proves it instead of claiming it: hold the button and the same
   six-stage strain escalation that ships in the game plays out, driven by the
   game's own artwork. No library, no canvas, just an opacity swap on six
   pre-registered frames.

   Deliberate details:
   - Pointer events cover mouse, touch and pen in one path; Space and Enter
     make it operable from a keyboard, since it is a real <button>.
   - Charge rises while held and decays when released, so letting go looks
     like release rather than a cut.
   - Reduced motion still works. It just jumps to a stage instead of easing.
   ========================================================================= */
(function () {
  var root = document.querySelector('[data-strain]');
  if (!root) return;

  var frames = Array.prototype.slice.call(root.querySelectorAll('[data-frame]'));
  var btn = root.querySelector('[data-hold]');
  var fill = root.querySelector('[data-fill]');
  var read = root.querySelector('[data-readout]');
  if (!frames.length || !btn) return;

  var STAGES = frames.length; // 6
  var RISE = 2400; // ms from composed to venting
  var FALL = 900; // ms back down once released
  var CAPTIONS = [
    'Composed. Nothing is wrong.',
    'Something is wrong.',
    'He is aware of the problem.',
    'The problem is winning.',
    'Structural failure.',
    'The whole capital knows.'
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var charge = 0; // 0..1
  var held = false;
  var last = 0;
  var raf = null;
  var shown = -1;

  function paint() {
    // Last stage is only reached at a full charge; the first five split the rest,
    // so the purple stage reads as an event rather than just another frame.
    var i = charge >= 0.995 ? STAGES - 1 : Math.min(STAGES - 2, Math.floor(charge * (STAGES - 1)));
    if (i !== shown) {
      shown = i;
      for (var f = 0; f < frames.length; f++) {
        frames[f].classList.toggle('is-on', f === i);
      }
      read.textContent = 'Stage ' + (i + 1) + ' of ' + STAGES + '. ' + CAPTIONS[i];
    }
    fill.style.transform = 'scaleX(' + charge.toFixed(3) + ')';
    root.classList.toggle('is-max', charge >= 0.995);
  }

  function tick(now) {
    var dt = Math.min(64, now - (last || now));
    last = now;
    charge += held ? dt / RISE : -dt / FALL;
    charge = Math.max(0, Math.min(1, charge));
    paint();
    if (held || charge > 0) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      last = 0;
    }
  }

  function start(e) {
    if (e && e.cancelable) e.preventDefault(); // stop touch-hold selecting text
    if (held) return;
    held = true;
    root.classList.add('is-held');
    if (reduce.matches) {
      charge = 1;
      paint();
      return;
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (!held) return;
    held = false;
    root.classList.remove('is-held');
    if (reduce.matches) {
      charge = 0;
      paint();
      return;
    }
    last = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  btn.addEventListener('pointerdown', start);
  // Listen on the window for release: a pointer that leaves the button mid-hold
  // must still let go, or the face stays stuck at maximum strain.
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);
  btn.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
  btn.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      start();
    }
  });
  btn.addEventListener('keyup', function (e) {
    if (e.key === ' ' || e.key === 'Enter') stop();
  });
  btn.addEventListener('blur', stop);

  paint();
})();
