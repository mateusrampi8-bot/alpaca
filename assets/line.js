"use strict";

(() => {
  const collection = document.querySelector("#line");
  if (!collection) return;
  const choices = [...collection.querySelectorAll("[data-line-choice]")];
  const previews = [...collection.querySelectorAll(".line-preview-source")];
  const image = collection.querySelector(".line-stage img");
  const open = collection.querySelector("[data-line-open]");
  const label = collection.querySelector("#line-color");
  const counter = collection.querySelector(".line-counter");
  let selected = 0;

  function select(index, focus = false) {
    selected = (index + choices.length) % choices.length;
    const choice = choices[selected];
    choices.forEach((button, i) => {
      button.setAttribute("aria-checked", String(i === selected));
      button.tabIndex = i === selected ? 0 : -1;
    });
    image.src = previews[selected].dataset.preview;
    image.alt = previews[selected].querySelector("img").alt;
    label.textContent = choice.dataset.color;
    counter.textContent = `${String(selected + 1).padStart(2, "0")} / ${choices.length}`;
    open.setAttribute(
      "aria-label",
      `Ampliar camiseta LINE: ${choice.dataset.color}`,
    );
    if (focus) choice.focus();
  }

  choices.forEach((choice, index) => {
    choice.addEventListener("click", () => select(index));
    choice.addEventListener("keydown", (event) => {
      let next = index;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) next++;
      else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next--;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = choices.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  });
  open.addEventListener("click", () => previews[selected].click());
  collection.querySelectorAll("[data-line-select]").forEach((teaser) => {
    teaser.addEventListener("click", () => {
      select(Number(teaser.dataset.lineSelect));
      collection.querySelector(".line-showcase").scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
    });
  });
})();
