"use strict";

(() => {
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
