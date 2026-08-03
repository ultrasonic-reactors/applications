// Faint waves that propagate from the pointer as it moves over the hero.
// Progressive enhancement: pages work identically without this script.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var THROTTLE_MS = 180;

  document.querySelectorAll(".hero").forEach(function (hero) {
    var last = 0;
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var now = performance.now();
      if (now - last < THROTTLE_MS) return;
      last = now;
      spawn(hero, e);
    });
  });

  function spawn(hero, e) {
    var rect = hero.getBoundingClientRect();
    var ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top = e.clientY - rect.top + "px";
    hero.appendChild(ripple);
    ripple.addEventListener("animationend", function () { ripple.remove(); });
    setTimeout(function () { ripple.remove(); }, 3000); // fallback cleanup
  }
})();
