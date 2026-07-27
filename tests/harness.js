/* Lädt index.html in jsdom, mit puzzles.js inline und ohne externe Ressourcen. */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");

function html() {
  let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const p = fs.readFileSync(path.join(ROOT, "puzzles.js"), "utf8");
  h = h.replace(/<link[^>]*fonts\.(googleapis|gstatic)[^>]*>/g, "");
  h = h.replace(/<link rel="manifest"[^>]*>/, "");
  h = h.replace('<script src="puzzles.js"></script>', "<script>" + p + "<\/script>");
  return h;
}

async function lade(opts = {}) {
  const dom = new JSDOM(html(), {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: opts.url || "https://example.test/vierdrei/"
  });
  const { window } = dom;
  window.navigator.serviceWorker = undefined;
  await neuerTick(window, 20);
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

module.exports = { lade, neuerTick, karten, karte, wortVon, waehle, pruefe, plaketten, meldung, offen, ROOT };
