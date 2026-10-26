"use strict";

(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const field = document.querySelector(".sakura-field");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 36; i++) {
    const petal = document.createElement("i");
    petal.className = "sakura-petal";
    petal.style.cssText = `--left:${(i * 37.7) % 100}%;--size:${7 + (i % 5) * 3}px;--opacity:${0.22 + (i % 4) * 0.1};--duration:${16 + (i % 7) * 3}s;--delay:-${i * 2.7}s`;
    fragment.append(petal);
  }
  field.append(fragment);

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
      if (event.pointerType === "touch" || reduced.matches) return;
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
