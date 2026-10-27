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

  function render() {
    queued = false;
    const rect = story.getBoundingClientRect();
    const range = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const progress = clamp(-rect.top / range);
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
      visual.classList.add("manual-turn");
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
  visual.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
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

  addEventListener("pageshow", schedule);
})();

(() => {
  const root = document.documentElement;
  const label = document.querySelector(".transition-label strong");
  const legacy = { "#line": "line.html", "#line-options": "line.html#line-options", "#lookbook": "fotos.html#lookbook" };
  if ((location.pathname.endsWith("/index.html") || location.pathname.endsWith("/")) && legacy[location.hash]) {
    location.replace(new URL(legacy[location.hash], location.href));
    return;
  }
  const setTheme = (theme) => {
    root.dataset.transition = theme;
    if (label) label.textContent = theme === "line" ? "LINE." : theme === "shogun" ? "FALLEN SHOGUN" : "ALPACA";
  };
  const themeFor = (url) => url.pathname.endsWith("/line.html") ? "line" : url.pathname.endsWith("/fallen-shogun.html") ? "shogun" : "brand";
  const menus = [...document.querySelectorAll(".collections-menu")];
  document.addEventListener("click", (event) => {
    menus.forEach((menu) => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const menu = menus.find((item) => item.open);
    if (!menu) return;
    menu.open = false;
    menu.querySelector("summary").focus();
  });

  // The destination determines the entrance, regardless of which link is used.
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
      link.hasAttribute("download")
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
    const theme = themeFor(next);
    setTheme(theme);
    root.classList.remove("page-arrival");
    root.classList.add("is-leaving");
    try {
      sessionStorage.setItem("alpaca-page-transition", JSON.stringify({ theme, at: Date.now(), destination: next.pathname }));
    } catch {}
    const duration = theme === "line" ? 1100 : theme === "shogun" ? 1200 : 520;
    setTimeout(() => location.assign(next.href), duration);
  });
  try {
    const saved = sessionStorage.getItem("alpaca-page-transition");
    if (saved) {
      sessionStorage.removeItem("alpaca-page-transition");
      const arrival = JSON.parse(saved);
      if (arrival.destination === location.pathname && Date.now() - arrival.at < 15000) {
        setTheme(arrival.theme);
        root.classList.add("page-arrival");
        setTimeout(() => root.classList.remove("page-arrival"), 1100);
      }
    }
  } catch {}
  addEventListener("pageshow", (event) => {
    navigating = false;
    root.classList.remove("is-leaving");
    if (event.persisted) root.classList.remove("page-arrival");
  });
})();
