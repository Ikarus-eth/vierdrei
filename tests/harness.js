/* Lädt index.html in jsdom, mit puzzles.js inline und ohne externe Ressourcen. */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");

function html(speicher) {
  let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const p = fs.readFileSync(path.join(ROOT, "puzzles.js"), "utf8");
  const k = fs.readFileSync(path.join(ROOT, "puzzles-kinder.js"), "utf8");
  h = h.replace(/<link[^>]*fonts\.(googleapis|gstatic)[^>]*>/g, "");
  h = h.replace(/<link rel="manifest"[^>]*>/, "");
  h = h.replace('<script src="puzzles.js"></script>', "<script>" + p + "<\/script>");
  h = h.replace('<script src="puzzles-kinder.js"></script>', "<script>" + k + "<\/script>");
  if (speicher) {
    // Wird vor dem App-Skript ausgeführt und simuliert einen früheren Besuch.
    const prime = Object.entries(speicher)
      .map(([k2, v]) => "localStorage.setItem(" + JSON.stringify(k2) + "," + JSON.stringify(JSON.stringify(v)) + ");")
      .join("");
    h = h.replace("<head>", "<head><script>" + prime + "<\/script>");
  }
  return h;
}

async function lade(opts = {}) {
  const dom = new JSDOM(html(opts.speicher), {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: opts.url || "https://example.test/vierdrei/"
  });
  const { window } = dom;
  window.navigator.serviceWorker = undefined;
  await neuerTick(window, 20);
  if (opts.welt) {                        // Welt umschalten wie ein Tastendruck
    window.document.querySelector('#start [data-welt="' + opts.welt + '"]').click();
    await neuerTick(window, 20);
  }
  const x = window.document.getElementById("x");
  if (x) x.click();                       // Anleitung beim ersten Start schließen
  return { dom, window, doc: window.document };
}

function neuerTick(window, ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function karten(doc) {
  return Array.from(doc.querySelectorAll("#raster .card"));
}
function wortVon(k) {
  // Gelöste Karten tragen zusätzlich die Stufenziffer.
  return k.querySelector("span").textContent.trim();
}
function karte(doc, wort) {
  return karten(doc).find((k) => wortVon(k) === wort);
}
function waehle(doc, woerter) {
  woerter.forEach((w) => {
    const k = karte(doc, w);
    if (!k) throw new Error("Karte nicht im Raster: " + w);
    k.click();
  });
}
function pruefe(doc) {
  doc.getElementById("btnPruefen").click();
}
function plaketten(doc) {
  return Array.from(doc.querySelectorAll("#geloest .plaque"));
}
function meldung(doc) {
  return doc.getElementById("msg").textContent.trim();
}
function offen(doc) {
  return doc.getElementById("sheet").classList.contains("open");
}
function startOffen(doc) {
  return doc.getElementById("start").classList.contains("open");
}

module.exports = { lade, neuerTick, karten, karte, wortVon, waehle, pruefe, plaketten, meldung, offen, startOffen, ROOT };
