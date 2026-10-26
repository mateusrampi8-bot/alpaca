"use strict";

(() => {
  // Use the same 2D renderer on desktop and mobile; CSS petals remain a fallback.
  const field = document.querySelector(".sakura-field");
  if (field) {
    const canvas = document.createElement("canvas");
    canvas.className = "sakura-canvas";
    const ctx = canvas.getContext("2d");
    if (ctx) {
      field.append(canvas);
      let width = 1, height = 1, frame = 0, previous = null, elapsed = 0;
      const petals = Array.from({ length: 60 }, (_, i) => ({
        x: ((i * 0.61803398875) % 1),
        y: ((i * 0.38196601125 + 0.12) % 1),
        radius: 6 + (i % 5) * 1.6,
        duration: 14 + (i % 7) * 2,
        angle: i * 2.4,
        spin: (i % 2 ? 1 : -1) * (0.35 + (i % 4) * 0.15),
        opacity: 0.5 + (i % 4) * 0.09,
        color: ["#f7c9d5", "#eaa4bb", "#f3b9ca"][i % 3],
      }));
      function resize() {
        width = field.clientWidth || window.innerWidth;
        height = field.clientHeight || window.innerHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      function render(now) {
        const dt = previous === null ? 0 : Math.min((now - previous) / 1000, 0.05);
        previous = now;
        elapsed += dt;
        ctx.clearRect(0, 0, width, height);
        // Keep a comfortable density on small screens without changing the renderer.
        const count = width < 600 ? 40 : petals.length;
        for (let i = 0; i < count; i++) {
          const petal = petals[i];
          petal.y = (petal.y + dt / petal.duration) % 1;
          const sway = Math.sin(elapsed * 0.6 + i * 1.7) * 35;
          const x = ((petal.x * width + sway + 40) % (width + 80)) - 40;
          const y = petal.y * (height + 64) - 32;
          const flutter = 0.4 + Math.abs(Math.sin(elapsed * 0.85 + i)) * 0.6;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(petal.angle + elapsed * petal.spin);
          ctx.scale(petal.radius * flutter, petal.radius * 0.72);
          ctx.globalAlpha = petal.opacity;
          ctx.fillStyle = petal.color;
          ctx.beginPath();
          ctx.moveTo(0, -1);
          ctx.bezierCurveTo(-1.15, -0.8, -1.1, 0.45, 0, 1);
          ctx.bezierCurveTo(1.1, 0.45, 1.15, -0.8, 0, -1);
          ctx.fill();
          ctx.restore();
        }
        // Hide the fallback only after a successful first canvas frame.
        field.dataset.renderer = "canvas";
        frame = requestAnimationFrame(render);
      }
      function start() {
        cancelAnimationFrame(frame);
        previous = null;
        resize();
        render(performance.now());
      }
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("pageshow", start);
      window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
      start();
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.06 });
    document.querySelectorAll(".shogun-reveal").forEach((el) => observer.observe(el));
    document.documentElement.classList.add("shogun-motion");
  }

  function tilt(surface, target, xName, yName, intensity) {
    let frame = 0;
    surface.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = surface.getBoundingClientRect();
        target.style.setProperty(xName, `${(0.5 - (event.clientY - box.top) / box.height) * intensity}deg`);
        target.style.setProperty(yName, `${((event.clientX - box.left) / box.width - 0.5) * intensity}deg`);
      });
    });
    surface.addEventListener("pointerleave", () => {
      cancelAnimationFrame(frame);
      target.style.setProperty(xName, "0deg");
      target.style.setProperty(yName, "0deg");
    });
  }
  const banner = document.querySelector(".shogun-banner");
  tilt(document.querySelector(".shogun-banner-frame"), banner, "--banner-x", "--banner-y", 6);
  document.querySelectorAll(".shogun-card").forEach((card) => {
    tilt(card.querySelector("button"), card.querySelector(".shogun-card-art"), "--tilt-x", "--tilt-y", 13);
  });
})();
