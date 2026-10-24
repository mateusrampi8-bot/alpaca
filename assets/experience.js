"use strict";

(() => {
  const story = document.querySelector(".scene-story");
  if (!story) return;
  const stage = story.querySelector(".scene-stage");
  const visual = story.querySelector(".scene-visual");
  const opening = story.querySelector(".scene-opening");
  const controls = [...story.querySelectorAll("[data-scene]")];
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  let manualAngle = null;
  let lastProgress = -1;
  let queued = false;
  let lastScroll = window.scrollY;

  const motionOff = () =>
    document.documentElement.classList.contains("motion-paused");
  function render() {
    queued = false;
    const rect = story.getBoundingClientRect();
    const range = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const progress = motionOff() ? 0 : clamp(-rect.top / range);
    const angle = manualAngle === null ? progress * 180 : manualAngle;
    const initialOpacity = clamp(1 - progress * 2.8);
    const endOpacity = clamp((progress - 0.55) / 0.3);
    story.style.setProperty("--scene-p", progress.toFixed(4));
    story.style.setProperty("--scene-angle", `${angle.toFixed(2)}deg`);
    story.style.setProperty(
      "--scene-shift",
      `${-progress * (innerWidth > 760 ? 45 : 0)}px`,
    );
    story.style.setProperty("--scene-zoom", `${1 + progress * 0.06}`);
    story.style.setProperty("--opening-opacity", initialOpacity.toFixed(3));
    story.style.setProperty("--ending-opacity", endOpacity.toFixed(3));
    story.style.setProperty("--ending-shift", `${(1 - endOpacity) * 40}px`);
    opening.inert = initialOpacity < 0.1;
    const side = angle > 90 ? 1 : 0;
    controls.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(Number(button.dataset.scene) === side),
      ),
    );
    lastProgress = progress;
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(render);
  }
  controls.forEach((button) =>
    button.addEventListener("click", () => {
      manualAngle = Number(button.dataset.scene) * 180;
      if (!motionOff()) visual.classList.add("manual-turn");
      render();
    }),
  );
  addEventListener(
    "scroll",
    () => {
      if (Math.abs(window.scrollY - lastScroll) > 3) {
        manualAngle = null;
        visual.classList.remove("manual-turn");
        lastScroll = window.scrollY;
      }
      if (story.getBoundingClientRect().bottom >= 0 || lastProgress < 1)
        schedule();
    },
    { passive: true },
  );
  addEventListener("resize", schedule);
  document.addEventListener("alpaca:motionchange", () => {
    story.style.setProperty("--pointer-x", "0deg");
    story.style.setProperty("--pointer-y", "0deg");
    schedule();
  });
  visual.addEventListener("pointermove", (event) => {
    if (motionOff() || event.pointerType === "touch") return;
    const rect = visual.getBoundingClientRect();
    story.style.setProperty(
      "--pointer-x",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 14}deg`,
    );
    story.style.setProperty(
      "--pointer-y",
      `${(0.5 - (event.clientY - rect.top) / rect.height) * 10}deg`,
    );
  });
  visual.addEventListener("pointerleave", () => {
    story.style.setProperty("--pointer-x", "0deg");
    story.style.setProperty("--pointer-y", "0deg");
  });
  render();

  // Same-origin page navigation uses a short curtain; hashes and external links stay native.
  let navigating = false;
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download") ||
      motionOff()
    )
      return;
    const next = new URL(link.href, location.href);
    if (
      next.origin !== location.origin ||
      next.pathname === location.pathname ||
      !next.pathname.endsWith(".html")
    )
      return;
    if (navigating) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    navigating = true;
    document.documentElement.classList.add("is-leaving");
    try {
      sessionStorage.setItem("alpaca-page-transition", "1");
    } catch {}
    setTimeout(() => location.assign(next.href), 520);
  });
  try {
    if (
      sessionStorage.getItem("alpaca-page-transition") === "1" &&
      !motionOff()
    ) {
      sessionStorage.removeItem("alpaca-page-transition");
      document.documentElement.classList.add("page-arrival");
      setTimeout(
        () => document.documentElement.classList.remove("page-arrival"),
        850,
      );
    }
  } catch {}
  addEventListener("pageshow", () => {
    navigating = false;
    document.documentElement.classList.remove("is-leaving");
    schedule();
  });
})();
