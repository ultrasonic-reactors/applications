// Ultrasound wave packets in the hero background.
//
// Every few seconds a packet of high-frequency pulses is emitted from a
// random origin: wave-wave-wave-wave-wave, then silence, then a new packet
// from somewhere else. Wavefronts reflect off the hero's borders as if they
// were hard walls. The reflection uses the method of images: a wave bouncing
// off a wall is identical to a wave emitted by the source's mirror image
// behind that wall, so each packet also fires from 8 mirror sources (4 edge
// reflections + 4 corner double reflections) and the canvas clipping does
// the rest.
//
// Progressive enhancement: pages work identically without this script.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SPEED = 340;       // wavefront speed, px/s
  var PULSES = 5;        // pulses per packet
  var PULSE_GAP = 0.15;  // s between pulses in a packet (the "high frequency")
  var PACKET_GAP = 10;    // s of silence between packets
  var LIFETIME = 5;       // s before a wavefront fades out completely
  var BASE_ALPHA = 0.45;  // peak line opacity
  var COLOR = "56, 189, 248";

  document.querySelectorAll(".hero").forEach(setup);

  function setup(hero) {
    var canvas = document.createElement("canvas");
    canvas.className = "waves";
    hero.prepend(canvas);
    var ctx = canvas.getContext("2d");

    var fronts = [];      // live wavefronts: {x, y, born}
    var nextPacket = 0.8; // small delay before the first packet
    var rafId = null;
    var visible = true;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      canvas.width = hero.clientWidth * dpr;
      canvas.height = hero.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fronts = []; // origins no longer match the new geometry
    }
    resize();
    window.addEventListener("resize", resize);

    function emitPacket(now) {
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      var x = (0.15 + 0.7 * Math.random()) * w;
      var y = (0.15 + 0.7 * Math.random()) * h;
      var sources = [
        [x, y],                                  // the real source
        [-x, y], [2 * w - x, y],                 // images across left/right walls
        [x, -y], [x, 2 * h - y],                 // images across top/bottom walls
        [-x, -y], [2 * w - x, -y],               // corner images (double bounce)
        [-x, 2 * h - y], [2 * w - x, 2 * h - y],
      ];
      for (var p = 0; p < PULSES; p++) {
        for (var s = 0; s < sources.length; s++) {
          fronts.push({ x: sources[s][0], y: sources[s][1], born: now + p * PULSE_GAP });
        }
      }
    }

    function frame() {
      rafId = null;
      var now = performance.now() / 1000;
      if (now >= nextPacket) {
        emitPacket(now);
        nextPacket = now + (PULSES - 1) * PULSE_GAP + PACKET_GAP;
      }

      ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
      fronts = fronts.filter(function (f) { return now - f.born < LIFETIME; });
      for (var i = 0; i < fronts.length; i++) {
        var age = now - fronts[i].born;
        if (age <= 0) continue; // pulse not emitted yet
        var r = age * SPEED;
        // fade with age, plus ~1/sqrt(r) amplitude decay of a 2-D wave
        // (gentle enough that reflections off the walls stay visible)
        var alpha = BASE_ALPHA * (1 - age / LIFETIME) / Math.sqrt(1 + r / 400);
        if (alpha < 0.005) continue;
        ctx.beginPath();
        ctx.arc(fronts[i].x, fronts[i].y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(" + COLOR + "," + alpha.toFixed(3) + ")";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (visible) rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (rafId === null && visible) rafId = requestAnimationFrame(frame);
    }
    function stop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    // Only animate while the hero is on screen and the tab is in view.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }).observe(hero);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });
  }
})();
