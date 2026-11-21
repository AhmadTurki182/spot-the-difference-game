// main.js — Spot the Difference game logic: rounds, timer, score, hints,
// mouse + keyboard play, markers, sounds (WebAudio, no files) and states.
(function () {
  'use strict';

  var LEVELS = window.SpotScenes.LEVELS;
  var left = document.getElementById('leftCanvas');
  var right = document.getElementById('rightCanvas');
  var lctx = left.getContext('2d');
  var rctx = right.getContext('2d');

  var el = {
    levelName: document.getElementById('levelName'),
    found: document.getElementById('foundCount'),
    leftCount: document.getElementById('leftCount'),
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    hints: document.getElementById('hints'),
    message: document.getElementById('message'),
    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayText: document.getElementById('overlayText'),
    levelPick: document.getElementById('levelPick'),
    playBtn: document.getElementById('playBtn'),
    hintBtn: document.getElementById('hintBtn'),
    nextBtn: document.getElementById('nextBtn'),
    restartBtn: document.getElementById('restartBtn'),
    soundBtn: document.getElementById('soundBtn')
  };

  var state = {
    level: 0, found: [], wrong: [], score: 0, totalScore: 0,
    timeLeft: 180, hintsLeft: 3, playing: false, over: false,
    cursor: { x: 260, y: 200, side: 'left' }, hintSpot: -1,
    soundOn: true, timerId: null, levelScore: 0
  };

  var audioCtx = null;
  function beep(freq, dur, type, vol) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.value = vol || 0.12;
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.stop(audioCtx.currentTime + dur);
    } catch (e) { /* sound is optional */ }
  }
  function soundGood() { beep(660, 0.12, 'sine'); setTimeout(function () { beep(880, 0.18, 'sine'); }, 90); }
  function soundBad() { beep(180, 0.2, 'square', 0.07); }
  function soundWin() { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { beep(f, 0.22, 'triangle'); }, i * 130); }); }

  function level() { return LEVELS[state.level]; }

  function drawAll() {
    var lv = level();
    var changed = new Set(lv.diffs.map(function (_, i) { return i; }));
    lv.draw(lctx, new Set());
    lv.draw(rctx, changed);
    drawMarks(lctx); drawMarks(rctx);
    drawCursor(lctx, 'left'); drawCursor(rctx, 'right');
  }

  function drawMarks(ctx) {
    state.found.forEach(function (i) {
      var d = level().diffs[i];
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#2e9e4f'; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d.x - 8, d.y); ctx.lineTo(d.x - 2, d.y + 7); ctx.lineTo(d.x + 10, d.y - 7);
      ctx.strokeStyle = '#2e9e4f'; ctx.lineWidth = 4; ctx.stroke();
    });
    state.wrong.forEach(function (w) {
      ctx.beginPath(); ctx.moveTo(w.x - 9, w.y - 9); ctx.lineTo(w.x + 9, w.y + 9);
      ctx.moveTo(w.x + 9, w.y - 9); ctx.lineTo(w.x - 9, w.y + 9);
      ctx.strokeStyle = 'rgba(230,57,70,0.9)'; ctx.lineWidth = 4; ctx.stroke();
    });
    if (state.hintSpot >= 0) {
      var d = level().diffs[state.hintSpot];
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffd93b'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]);
    }
  }

  function drawCursor(ctx, side) {
    if (!state.playing || state.cursor.side !== side) return;
    var c = state.cursor;
    ctx.beginPath(); ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#2e86ab'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(c.x - 20, c.y); ctx.lineTo(c.x + 20, c.y);
    ctx.moveTo(c.x, c.y - 20); ctx.lineTo(c.x, c.y + 20);
    ctx.strokeStyle = '#2e86ab'; ctx.lineWidth = 2; ctx.stroke();
  }

  function updateHud() {
    var lv = level();
    el.levelName.textContent = lv.name;
    el.found.textContent = state.found.length + ' / ' + lv.diffs.length;
    el.leftCount.textContent = (lv.diffs.length - state.found.length) + ' left';
    el.score.textContent = state.totalScore + state.levelScore;
    var m = Math.floor(state.timeLeft / 60), s = state.timeLeft % 60;
    el.timer.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    el.hints.textContent = state.hintsLeft;
  }

  function say(text) { el.message.textContent = text; }

  function startLevel(idx, keepScore) {
    state.level = idx;
    state.found = []; state.wrong = []; state.hintSpot = -1;
    state.levelScore = 0; state.hintsLeft = 3;
    state.timeLeft = level().time;
    state.playing = true; state.over = false;
    if (!keepScore) state.totalScore = 0;
    clearInterval(state.timerId);
    state.timerId = setInterval(tick, 1000);
    el.overlay.classList.add('hidden');
    drawAll(); updateHud();
    say('Level ' + (idx + 1) + ': ' + level().name + ' — find all ' + level().diffs.length + ' differences!');
  }

  function tick() {
    if (!state.playing || state.over) return;
    state.timeLeft--;
    if (state.timeLeft <= 0) { state.timeLeft = 0; updateHud(); endLevel(false); return; }
    updateHud();
  }

  function checkSpot(x, y) {
    if (!state.playing || state.over) return;
    var lv = level();
    for (var i = 0; i < lv.diffs.length; i++) {
      if (state.found.indexOf(i) >= 0) continue;
      var d = lv.diffs[i];
      var dx = x - d.x, dy = y - d.y;
      if (dx * dx + dy * dy <= (d.r + 10) * (d.r + 10)) {
        state.found.push(i); state.hintSpot = -1;
        var gained = 100 + Math.max(0, state.timeLeft);
        state.levelScore += gained;
        soundGood();
        say('Found it! ' + d.label.charAt(0).toUpperCase() + d.label.slice(1) + ' (+' + gained + ' points). ' +
            (lv.diffs.length - state.found.length) + ' still hiding.');
        state.wrong = state.wrong.filter(function (w) { return Math.hypot(w.x - d.x, w.y - d.y) > 30; });
        drawAll(); updateHud();
        if (state.found.length === lv.diffs.length) endLevel(true);
        return;
      }
    }
    state.wrong.push({ x: x, y: y, t: Date.now() });
    if (state.wrong.length > 5) state.wrong.shift();
    state.levelScore = Math.max(0, state.levelScore - 25);
    soundBad();
    say('Not a difference — try again! (-25 points, 5 seconds lost.)');
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    drawAll(); updateHud();
  }

  function useHint() {
    if (!state.playing || state.over) return;
    if (state.hintsLeft <= 0) { say('No hints left — trust your eyes!'); return; }
    var remaining = level().diffs.map(function (_, i) { return i; })
      .filter(function (i) { return state.found.indexOf(i) < 0; });
    if (!remaining.length) return;
    state.hintsLeft--;
    state.hintSpot = remaining[Math.floor(Math.random() * remaining.length)];
    state.levelScore = Math.max(0, state.levelScore - 50);
    beep(520, 0.15, 'triangle');
    say('Hint: look inside the yellow ring. (-50 points)');
    drawAll(); updateHud();
  }

  function endLevel(won) {
    state.playing = false; state.over = true;
    clearInterval(state.timerId);
    if (won) {
      var bonus = state.timeLeft * 2;
      state.levelScore += bonus;
      state.totalScore += state.levelScore;
      soundWin();
      var last = state.level === LEVELS.length - 1;
      el.overlayTitle.textContent = last ? 'You found them ALL!' : 'Level complete!';
      el.overlayText.textContent = 'You found all ' + level().diffs.length + ' differences in ' + level().name +
        ' with ' + state.timeLeft + 's to spare (+' + bonus + ' time bonus). Total score: ' + state.totalScore + '.';
      el.playBtn.textContent = last ? 'Play again' : 'Next level';
      el.playBtn.onclick = function () { startLevel(last ? 0 : state.level + 1, !last); };
      el.overlay.classList.remove('hidden');
      say('Level complete! Score: ' + state.totalScore + '.');
    } else {
      soundBad();
      el.overlayTitle.textContent = "Time's up!";
      el.overlayText.textContent = 'You found ' + state.found.length + ' of ' + level().diffs.length +
        ' differences in ' + level().name + '. The rest were hiding in plain sight — try again!';
      el.playBtn.textContent = 'Try again';
      el.playBtn.onclick = function () { startLevel(state.level, true); };
      el.overlay.classList.remove('hidden');
      say("Time's up — " + state.found.length + ' of ' + level().diffs.length + ' found.');
    }
    updateHud();
  }

  function showTitle() {
    state.playing = false;
    el.overlayTitle.textContent = 'Welcome, detective!';
    el.overlayText.textContent = 'Two pictures look the same — but seven things changed in each level. ' +
      'Find them all before the clock runs out. Three levels: Sunny Park, Sandy Beach and Cozy Kitchen.';
    el.levelPick.innerHTML = '';
    LEVELS.forEach(function (lv, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = (i + 1) + '. ' + lv.name;
      if (i === state.level) b.className = 'active';
      b.onclick = function () { state.level = i; startLevel(i, false); };
      el.levelPick.appendChild(b);
    });
    el.playBtn.textContent = 'Start playing';
    el.playBtn.onclick = function () { startLevel(state.level, false); };
    el.overlay.classList.remove('hidden');
    drawAll(); updateHud();
  }

  function canvasPos(canvas, ev) {
    var r = canvas.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * canvas.width / r.width, y: (ev.clientY - r.top) * canvas.height / r.height };
  }

  [left, right].forEach(function (canvas, idx) {
    canvas.addEventListener('click', function (ev) {
      var p = canvasPos(canvas, ev);
      state.cursor = { x: p.x, y: p.y, side: idx === 0 ? 'left' : 'right' };
      checkSpot(p.x, p.y);
    });
    canvas.addEventListener('mousemove', function (ev) {
      var p = canvasPos(canvas, ev);
      state.cursor = { x: p.x, y: p.y, side: idx === 0 ? 'left' : 'right' };
      if (state.playing) drawAll();
    });
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Tab') return;
    var step = ev.shiftKey ? 24 : 10;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (!state.playing) return;
      if (ev.key === 'ArrowLeft') state.cursor.x = Math.max(0, state.cursor.x - step);
      if (ev.key === 'ArrowRight') state.cursor.x = Math.min(520, state.cursor.x + step);
      if (ev.key === 'ArrowUp') state.cursor.y = Math.max(0, state.cursor.y - step);
      if (ev.key === 'ArrowDown') state.cursor.y = Math.min(400, state.cursor.y + step);
      drawAll();
    } else if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      if (!state.playing && !el.overlay.classList.contains('hidden')) { el.playBtn.click(); return; }
      checkSpot(state.cursor.x, state.cursor.y);
    } else if (ev.key === 'h' || ev.key === 'H') { useHint(); }
    else if (ev.key === 'n' || ev.key === 'N') { if (state.playing) startLevel((state.level + 1) % LEVELS.length, true); }
    else if (ev.key === 'r' || ev.key === 'R') { if (state.playing) startLevel(state.level, true); }
    else if (ev.key === 'm' || ev.key === 'M') { toggleSound(); }
  });

  function toggleSound() {
    state.soundOn = !state.soundOn;
    el.soundBtn.textContent = 'Sound: ' + (state.soundOn ? 'on' : 'off');
  }

  el.hintBtn.addEventListener('click', useHint);
  el.nextBtn.addEventListener('click', function () { startLevel((state.level + 1) % LEVELS.length, true); });
  el.restartBtn.addEventListener('click', function () { startLevel(state.level, true); });
  el.soundBtn.addEventListener('click', toggleSound);

  // Screenshot mode: ?shot=title|mid|win|end presets a state so the screenshots
  // show the real game (same code path as playing). ?level=0|1|2 picks the scene.
  var params = new URLSearchParams(window.location.search);
  var shotLevel = parseInt(params.get('level') || '0', 10);
  if (LEVELS[shotLevel]) state.level = shotLevel;
  var shot = params.get('shot');
  if (shot === 'mid' || shot === 'win') {
    state.playing = true;
    state.found = shot === 'mid' ? [0, 2, 4] : [0, 1, 2, 3, 4, 5, 6];
    state.wrong = shot === 'mid' ? [{ x: 300, y: 300, t: 0 }] : [];
    state.timeLeft = shot === 'mid' ? 112 : 64;
    state.levelScore = shot === 'mid' ? 486 : 1240;
    el.overlay.classList.add('hidden');
    drawAll(); updateHud();
    if (shot === 'mid') {
      var foundLabels = state.found.map(function (i) { return level().diffs[i].label; });
      say('Nice — 3 found! ' + foundLabels.join('; ') + '. 4 still hiding.');
    } else {
      say('You found all 7 differences! Brilliant detective work.');
    }
    if (shot === 'win') { state.playing = false; state.over = true; }
  } else {
    showTitle();
    if (shot === 'title') { /* title overlay already shown by showTitle() */ }
  }
})();
