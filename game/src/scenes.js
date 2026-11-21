// scenes.js — original procedural art for Spot the Difference.
// Every picture is drawn in code (canvas shapes only). No images, no borrowed art.
// Each level: draw(ctx, changed) draws the scene; `changed` is a Set of diff
// indexes that are applied only to the right-hand picture. A diff's x/y is the
// spot the player must click, on either picture.
(function (global) {
  'use strict';

  function circle(ctx, x, y, r, fill) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  }
  function ellipse(ctx, x, y, rx, ry, fill) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  }
  function rect(ctx, x, y, w, h, fill) {
    ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  }
  function line(ctx, x1, y1, x2, y2, color, width) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.stroke();
  }
  function cloud(ctx, x, y, s) {
    ctx.fillStyle = '#ffffff';
    circle(ctx, x, y, 18 * s, '#ffffff'); circle(ctx, x + 20 * s, y - 8 * s, 22 * s, '#ffffff');
    circle(ctx, x + 44 * s, y, 18 * s, '#ffffff'); rect(ctx, x - 18 * s, y, 80 * s, 16 * s, '#ffffff');
  }
  function flower(ctx, x, y, petal) {
    for (var i = 0; i < 5; i++) {
      var a = i * Math.PI * 2 / 5 - Math.PI / 2;
      circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
    }
    circle(ctx, x, y, 5, '#ffcf3f');
    line(ctx, x, y + 6, x, y + 22, '#2e7d32', 3);
  }

  // ---------- Level 1: Sunny Park ----------
  function drawPark(ctx, changed) {
    rect(ctx, 0, 0, 520, 400, '#aee6ff');            // sky
    rect(ctx, 0, 280, 520, 120, '#7ec850');          // grass
    circle(ctx, 70, 60, 34, '#ffd93b');              // sun
    if (!changed.has(0)) {                           // diff 0: sun's rays
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        line(ctx, 70 + Math.cos(a) * 42, 60 + Math.sin(a) * 42,
             70 + Math.cos(a) * 56, 60 + Math.sin(a) * 56, '#f5b301', 4);
      }
    }
    cloud(ctx, 300, 55, 1);                          // clouds
    if (!changed.has(1)) cloud(ctx, 420, 90, 0.8);   // diff 1: second cloud gone
    // big tree, left
    rect(ctx, 128, 170, 18, 115, '#7a4a21');
    circle(ctx, 137, 140, 62, '#2e9e4f'); circle(ctx, 95, 165, 38, '#37b25e'); circle(ctx, 180, 165, 38, '#37b25e');
    circle(ctx, 110, 130, 8, '#e63946'); circle(ctx, 165, 125, 8, '#e63946');
    if (!changed.has(2)) circle(ctx, 140, 155, 8, '#e63946'); // diff 2: third apple gone
    // bench, right
    rect(ctx, 350, 250, 120, 10, '#8d5a2b'); rect(ctx, 350, 272, 120, 10, '#8d5a2b');
    if (!changed.has(3)) rect(ctx, 350, 261, 120, 6, '#8d5a2b'); // diff 3: middle slat gone
    rect(ctx, 358, 282, 10, 40, '#5d3a17'); rect(ctx, 452, 282, 10, 40, '#5d3a17');
    // pond, bottom right
    ellipse(ctx, 430, 355, 70, 22, '#4db2e8');
    // flowers along the bottom
    flower(ctx, 40, 340, '#ff6b9d'); flower(ctx, 90, 355, '#ff6b9d');
    flower(ctx, 200, 350, changed.has(4) ? '#7b61ff' : '#ff6b9d'); // diff 4: flower turns purple
    flower(ctx, 260, 340, '#ff6b9d');
    // bird in the sky
    if (!changed.has(5)) {                           // diff 5: bird gone
      ctx.beginPath(); ctx.moveTo(230, 120); ctx.quadraticCurveTo(240, 110, 250, 120);
      ctx.quadraticCurveTo(260, 110, 270, 120); ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.stroke();
    }
    // kite
    line(ctx, 320, 200, 380, 130, '#888', 1);
    ctx.beginPath(); ctx.moveTo(380, 130); ctx.lineTo(410, 150); ctx.lineTo(390, 170); ctx.closePath();
    ctx.fillStyle = '#e63946'; ctx.fill();
    if (!changed.has(6)) {                           // diff 6: kite tail bows gone
      line(ctx, 395, 168, 385, 205, '#e63946', 2);
      circle(ctx, 390, 182, 4, '#ffd93b'); circle(ctx, 387, 198, 4, '#ffd93b');
    }
    // path
    ellipse(ctx, 250, 385, 130, 14, '#e8d5a3');
  }

  // ---------- Level 2: Sandy Beach ----------
  function drawBeach(ctx, changed) {
    rect(ctx, 0, 0, 520, 400, '#aee6ff');
    rect(ctx, 0, 230, 520, 80, '#2f9be8');           // sea
    rect(ctx, 0, 310, 520, 90, '#f2d492');           // sand
    circle(ctx, 450, 55, 32, '#ffd93b');             // sun
    if (!changed.has(0)) {                           // diff 0: sun wears sunglasses
      rect(ctx, 432, 48, 36, 12, '#222'); line(ctx, 450, 52, 450, 58, '#222', 2);
    }
    cloud(ctx, 90, 50, 1);
    if (!changed.has(1)) cloud(ctx, 220, 80, 0.7);   // diff 1: cloud gone
    // sailboat
    ctx.beginPath(); ctx.moveTo(300, 250); ctx.lineTo(360, 250); ctx.lineTo(345, 268); ctx.lineTo(315, 268); ctx.closePath();
    ctx.fillStyle = '#8d5a2b'; ctx.fill();
    line(ctx, 330, 250, 330, 195, '#5d3a17', 3);
    ctx.beginPath(); ctx.moveTo(330, 198); ctx.lineTo(330, 248); ctx.lineTo(362, 248); ctx.closePath();
    ctx.fillStyle = changed.has(2) ? '#2ec4b6' : '#ffffff'; ctx.fill(); // diff 2: sail turns teal
    // umbrella
    line(ctx, 130, 330, 130, 215, '#8d5a2b', 4);
    ctx.beginPath(); ctx.moveTo(60, 220); ctx.quadraticCurveTo(130, 165, 200, 220); ctx.closePath();
    ctx.fillStyle = '#e63946'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(95, 220); ctx.quadraticCurveTo(130, 180, 165, 220); ctx.closePath();
    ctx.fillStyle = '#ffffff'; ctx.fill();
    if (!changed.has(3)) {                           // diff 3: umbrella top knob gone
      circle(ctx, 130, 178, 6, '#ffd93b');
    }
    // sandcastle
    rect(ctx, 300, 330, 90, 45, '#e8b96a');
    rect(ctx, 312, 305, 18, 28, '#e8b96a'); rect(ctx, 360, 305, 18, 28, '#e8b96a');
    if (!changed.has(4)) {                           // diff 4: castle flag gone
      line(ctx, 369, 305, 369, 282, '#333', 2);
      ctx.beginPath(); ctx.moveTo(369, 282); ctx.lineTo(388, 288); ctx.lineTo(369, 294); ctx.closePath();
      ctx.fillStyle = '#e63946'; ctx.fill();
    }
    // bucket and spade
    ctx.beginPath(); ctx.moveTo(215, 345); ctx.lineTo(245, 345); ctx.lineTo(240, 372); ctx.lineTo(220, 372); ctx.closePath();
    ctx.fillStyle = '#2e86ab'; ctx.fill();
    line(ctx, 255, 340, 275, 372, '#e63946', 4);
    // starfish
    ctx.fillStyle = changed.has(5) ? '#ff9f1c' : '#ff6b9d'; // diff 5: starfish turns orange
    circle(ctx, 90, 372, 10, ctx.fillStyle);
    // crab
    ellipse(ctx, 470, 360, 22, 14, '#e63946');
    circle(ctx, 462, 344, 4, '#222'); circle(ctx, 478, 344, 4, '#222');
    if (!changed.has(6)) {                           // diff 6: crab's raised claw gone
      line(ctx, 488, 352, 502, 336, '#e63946', 4); circle(ctx, 503, 334, 6, '#e63946');
    }
    // palm tree
    rect(ctx, 40, 240, 12, 75, '#7a4a21');
    for (var i = 0; i < 4; i++) {
      var a = -Math.PI / 2 + (i - 1.5) * 0.55;
      line(ctx, 46, 242, 46 + Math.cos(a) * 42, 242 + Math.sin(a) * 42, '#2e9e4f', 6);
    }
    circle(ctx, 40, 250, 7, '#6b4226'); circle(ctx, 54, 252, 7, '#6b4226');
  }

  // ---------- Level 3: Cozy Kitchen ----------
  function drawKitchen(ctx, changed) {
    rect(ctx, 0, 0, 520, 400, '#ffe8c2');            // wall
    rect(ctx, 0, 300, 520, 100, '#c98f5f');          // floor
    // window
    rect(ctx, 40, 40, 150, 130, '#aee6ff');
    rect(ctx, 40, 40, 150, 130, 'rgba(0,0,0,0)');
    ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 6; ctx.strokeRect(40, 40, 150, 130);
    line(ctx, 115, 40, 115, 170, '#8d5a2b', 4); line(ctx, 40, 105, 190, 105, '#8d5a2b', 4);
    circle(ctx, 155, 70, 18, '#ffd93b');
    rect(ctx, 30, 32, 22, 146, changed.has(0) ? '#2e86ab' : '#e63946'); // diff 0: curtain turns blue
    rect(ctx, 178, 32, 22, 146, changed.has(0) ? '#2e86ab' : '#e63946');
    // clock
    circle(ctx, 330, 85, 38, '#ffffff'); ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(330, 85, 38, 0, Math.PI * 2); ctx.stroke();
    line(ctx, 330, 85, 330, 58, '#333', 3);
    if (!changed.has(1)) line(ctx, 330, 85, 352, 92, '#333', 3); // diff 1: minute hand gone
    else line(ctx, 330, 85, 312, 98, '#333', 3);
    // shelf with jars
    rect(ctx, 280, 150, 200, 10, '#8d5a2b');
    rect(ctx, 300, 118, 30, 32, '#7fb069'); rect(ctx, 345, 118, 30, 32, '#e07a5f');
    if (!changed.has(2)) rect(ctx, 390, 118, 30, 32, '#f2cc8f'); // diff 2: third jar gone
    // table
    rect(ctx, 60, 290, 400, 16, '#8d5a2b'); rect(ctx, 80, 306, 14, 70, '#5d3a17'); rect(ctx, 426, 306, 14, 70, '#5d3a17');
    // teapot with steam
    ellipse(ctx, 150, 278, 34, 20, '#2e86ab');
    ctx.beginPath(); ctx.moveTo(184, 272); ctx.quadraticCurveTo(200, 262, 184, 252); ctx.strokeStyle = '#2e86ab'; ctx.lineWidth = 5; ctx.stroke();
    if (!changed.has(3)) {                           // diff 3: steam gone
      ctx.beginPath(); ctx.moveTo(140, 252); ctx.quadraticCurveTo(132, 238, 142, 226);
      ctx.quadraticCurveTo(150, 214, 140, 202); ctx.strokeStyle = '#bbb'; ctx.lineWidth = 3; ctx.stroke();
    }
    // fruit bowl
    ellipse(ctx, 330, 282, 55, 14, '#e63946');
    circle(ctx, 310, 272, 12, '#e63946'); circle(ctx, 335, 268, 12, '#ff9f1c');
    if (!changed.has(4)) circle(ctx, 355, 274, 12, '#7fb069'); // diff 4: green apple gone
    // cat sleeping on the rug
    ellipse(ctx, 430, 350, 48, 16, '#f2a541');
    circle(ctx, 462, 338, 14, '#f2a541');
    ctx.beginPath(); ctx.moveTo(452, 328); ctx.lineTo(456, 318); ctx.lineTo(460, 328); ctx.closePath();
    ctx.fillStyle = '#f2a541'; ctx.fill();
    if (!changed.has(5)) {                           // diff 5: cat's tail gone
      ctx.beginPath(); ctx.moveTo(386, 350); ctx.quadraticCurveTo(368, 336, 378, 322);
      ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 7; ctx.stroke();
    }
    // picture frame on the wall
    rect(ctx, 430, 60, 60, 50, '#8d5a2b'); rect(ctx, 436, 66, 48, 38, '#aee6ff');
    circle(ctx, 460, 88, 10, changed.has(6) ? '#e63946' : '#ffd93b'); // diff 6: picture sun turns red
    // mug
    rect(ctx, 230, 262, 30, 28, '#7b61ff');
    ctx.beginPath(); ctx.arc(262, 276, 10, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = '#7b61ff'; ctx.lineWidth = 4; ctx.stroke();
  }

  var LEVELS = [
    {
      name: 'Sunny Park', time: 180,
      draw: drawPark,
      diffs: [
        { x: 70, y: 60, r: 30, label: 'the sun lost its rays' },
        { x: 420, y: 90, r: 26, label: 'a cloud vanished' },
        { x: 140, y: 155, r: 16, label: 'an apple is missing from the tree' },
        { x: 410, y: 264, r: 16, label: 'the bench lost a slat' },
        { x: 200, y: 350, r: 16, label: 'a flower changed colour' },
        { x: 250, y: 118, r: 18, label: 'the bird flew away' },
        { x: 390, y: 185, r: 20, label: 'the kite lost its tail bows' }
      ]
    },
    {
      name: 'Sandy Beach', time: 180,
      draw: drawBeach,
      diffs: [
        { x: 450, y: 54, r: 24, label: 'the sun is wearing sunglasses' },
        { x: 220, y: 80, r: 24, label: 'a cloud vanished' },
        { x: 346, y: 224, r: 26, label: 'the sail changed colour' },
        { x: 130, y: 178, r: 14, label: 'the umbrella lost its knob' },
        { x: 375, y: 290, r: 18, label: 'the castle flag is gone' },
        { x: 90, y: 372, r: 16, label: 'the starfish changed colour' },
        { x: 498, y: 340, r: 18, label: "the crab lost its raised claw" }
      ]
    },
    {
      name: 'Cozy Kitchen', time: 180,
      draw: drawKitchen,
      diffs: [
        { x: 115, y: 105, r: 30, label: 'the curtains changed colour' },
        { x: 330, y: 85, r: 30, label: 'the clock lost a hand' },
        { x: 405, y: 134, r: 20, label: 'a jar is missing from the shelf' },
        { x: 141, y: 228, r: 18, label: 'the teapot stopped steaming' },
        { x: 355, y: 274, r: 16, label: 'the green apple is gone' },
        { x: 378, y: 336, r: 18, label: "the cat's tail disappeared" },
        { x: 460, y: 88, r: 18, label: 'the sun in the picture turned red' }
      ]
    }
  ];

  global.SpotScenes = { LEVELS: LEVELS };
})(typeof window !== 'undefined' ? window : globalThis);
