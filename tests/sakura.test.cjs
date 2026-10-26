const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../assets/fallen-shogun.js"), "utf8");

function collection({ width, height, ratio = 1, canvasAvailable = true }) {
  const callbacks = new Map();
  const events = {};
  const frames = [];
  let nextFrame = 0;
  let point;
  const ctx = {
    setTransform(...args) { this.transform = args; },
    clearRect() { frames.push([]); },
    translate(x, y) { point = [x, y]; },
    fill() { frames.at(-1).push(point); },
    save() {}, restore() {}, rotate() {}, scale() {},
    beginPath() {}, moveTo() {}, bezierCurveTo() {}, lineTo() {}, closePath() {}, stroke() {},
    createLinearGradient() { return { addColorStop() {} }; },
  };
  const field = { clientWidth: width, clientHeight: height, dataset: {}, children: [], append(el) { this.children.push(el); } };
  const canvas = { getContext: () => canvasAvailable ? ctx : null };
  const surface = { addEventListener() {} };
  const target = { style: { setProperty() {} } };
  const window = {
    innerWidth: width, innerHeight: height, devicePixelRatio: ratio,
    addEventListener(name, fn) { events[name] = fn; },
  };
  const requestAnimationFrame = (callback) => { callbacks.set(++nextFrame, callback); return nextFrame; };
  vm.runInNewContext(source, {
    window,
    // Simulate the system setting that previously disabled desktop motion.
    matchMedia: () => ({ matches: true }),
    performance: { now: () => 1000 },
    requestAnimationFrame,
    cancelAnimationFrame: (id) => callbacks.delete(id),
    document: {
      createElement: () => canvas,
      querySelector: (selector) => selector === ".sakura-field" ? field : selector === ".shogun-banner" ? target : surface,
      querySelectorAll: () => [],
    },
  });
  function step(time) {
    const entry = callbacks.entries().next().value;
    assert.ok(entry, "Animation must schedule another frame");
    callbacks.delete(entry[0]);
    entry[1](time);
  }
  return { field, canvas, ctx, callbacks, events, frames, step };
}

for (const [name, size] of Object.entries({
  desktop: { width: 1920, height: 1080, ratio: 1 },
  laptop: { width: 1366, height: 768, ratio: 1.25 },
  android: { width: 393, height: 851, ratio: 2.75 },
  iphone: { width: 390, height: 844, ratio: 3 },
})) {
  test(`Sakura draws and moves at ${name} dimensions with system animations disabled`, () => {
    const app = collection(size);
    assert.equal(app.field.dataset.renderer, "canvas");
    assert.equal(app.canvas.width, Math.round(size.width * Math.min(size.ratio, 2)));
    assert.equal(app.canvas.height, Math.round(size.height * Math.min(size.ratio, 2)));
    const initial = app.frames[0];
    assert.ok(initial.filter(([x, y]) => x >= 0 && x <= size.width && y >= 0 && y <= size.height).length >= 30);
    app.step(1016);
    const moved = app.frames[1];
    assert.notEqual(moved[0][1], initial[0][1], "Petals must move while browsing, without scroll or mouse input");
    assert.equal(app.callbacks.size, 1);
  });
}

test("Resize and browser Back/Forward retain a single running animation", () => {
  const app = collection({ width: 1920, height: 1080 });
  app.field.clientWidth = 390;
  app.field.clientHeight = 844;
  app.events.resize();
  app.step(1032);
  assert.equal(app.canvas.width, 390);
  assert.equal(app.canvas.height, 844);
  assert.ok(app.frames.at(-1).length >= 30);
  app.events.pagehide();
  assert.equal(app.callbacks.size, 0);
  app.events.pageshow();
  assert.equal(app.callbacks.size, 1);
  app.events.pageshow();
  assert.equal(app.callbacks.size, 1);
  app.step(1048);
});

test("Unavailable Canvas leaves the HTML/CSS petals visible", () => {
  const app = collection({ width: 1366, height: 768, canvasAvailable: false });
  assert.equal(app.field.dataset.renderer, undefined);
  assert.equal(app.field.children.length, 0);
  assert.equal(app.callbacks.size, 0);
  const html = fs.readFileSync(path.join(__dirname, "../fallen-shogun.html"), "utf8");
  assert.equal((html.match(/class="sakura-petal"/g) || []).length, 42);
});

test("Petals stay behind the entire collection, including transformed product photos", () => {
  const css = fs.readFileSync(path.join(__dirname, "../assets/fallen-shogun.css"), "utf8");
  const background = css.match(/\.sakura-field\s*\{([^}]+)\}/)[1];
  const content = css.match(/\.shogun main, \.shogun \.site-footer\s*\{([^}]+)\}/)[1];
  assert.match(background, /position:\s*fixed/);
  assert.match(background, /z-index:\s*0/);
  assert.match(content, /position:\s*relative/);
  assert.match(content, /z-index:\s*1/);
  assert.match(background, /pointer-events:\s*none/);
});
