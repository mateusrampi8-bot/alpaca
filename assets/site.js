"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionButtons = [
  ...document.querySelectorAll(".motion-control, [data-motion-toggle]"),
];
let motionPreference = "auto";
try {
  const saved = localStorage.getItem("alpaca-motion");
  if (saved === "paused" || saved === "enabled") motionPreference = saved;
} catch {}
let paused;
function setMotion() {
  paused =
    motionPreference === "paused" ||
    (motionPreference !== "enabled" && reducedMotion.matches);
  document.documentElement.classList.toggle("motion-paused", paused);
  document.documentElement.classList.toggle(
    "motion-forced",
    motionPreference === "enabled",
  );
  motionButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Ativar animações" : "Pausar animações";
  });
  if (paused) {
    const heroArt = document.querySelector(".hero-art");
    if (heroArt) heroArt.style.transform = "";
  }
  document.dispatchEvent(
    new CustomEvent("alpaca:motionchange", { detail: { paused } }),
  );
}
setMotion();
motionButtons.forEach((button) =>
  button.addEventListener("click", () => {
    motionPreference = paused ? "enabled" : "paused";
    setMotion();
    try {
      localStorage.setItem("alpaca-motion", motionPreference);
    } catch {}
  }),
);
if (reducedMotion.addEventListener)
  reducedMotion.addEventListener("change", setMotion);
else reducedMotion.addListener?.(setMotion);

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
function closeMenu() {
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("open", open);
});
menu
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
  document.documentElement.classList.add("motion-enabled");
}

const filters = document.querySelectorAll(".filter");
filters.forEach((filter) =>
  filter.addEventListener("click", () => {
    filters.forEach((button) =>
      button.setAttribute("aria-pressed", String(button === filter)),
    );
    let count = 0;
    document.querySelectorAll(".product").forEach((product) => {
      const visible =
        filter.dataset.filter === "all" ||
        product.dataset.category === filter.dataset.filter;
      product.hidden = !visible;
      if (visible) count++;
    });
    const result = document.getElementById("filter-result");
    if (result)
      result.textContent = `${String(count).padStart(2, "0")} peças na seleção`;
  }),
);

const dialog = document.querySelector(".dialog");
const triggers = [...document.querySelectorAll("[data-preview]")];
let activeGroup = [],
  activeIndex = 0,
  opener;
function showPreview(index) {
  activeIndex = (index + activeGroup.length) % activeGroup.length;
  const trigger = activeGroup[activeIndex];
  document.getElementById("preview-image").src = trigger.dataset.preview;
  document.getElementById("preview-image").alt =
    trigger.querySelector("img").alt;
  document.getElementById("preview-title").textContent = trigger.dataset.title;
  document.getElementById("preview-description").textContent =
    trigger.dataset.description;
  document.getElementById("preview-counter").textContent =
    `${activeIndex + 1} / ${activeGroup.length}`;
}
triggers.forEach((trigger) =>
  trigger.addEventListener("click", () => {
    opener =
      trigger.dataset.group === "line"
        ? document.querySelector("[data-line-open]")
        : trigger;
    activeGroup = triggers.filter(
      (item) =>
        item.dataset.group === trigger.dataset.group &&
        (item.dataset.group === "line" || !item.closest("[hidden]")),
    );
    showPreview(activeGroup.indexOf(trigger));
    dialog.showModal();
    document.body.classList.add("locked");
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
document
  .querySelector("[data-prev]")
  .addEventListener("click", () => showPreview(activeIndex - 1));
document
  .querySelector("[data-next]")
  .addEventListener("click", () => showPreview(activeIndex + 1));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPreview(activeIndex - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showPreview(activeIndex + 1);
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("locked");
  opener?.focus();
});
