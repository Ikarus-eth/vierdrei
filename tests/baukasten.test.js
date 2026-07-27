/* build.html: die Live-Prüfung muss dieselben Regeln durchsetzen wie
 * tests/daten.test.js — sonst baut man Rätsel, die der Test später ablehnt. */
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { JSDOM } = require("jsdom");

const t = [];
function test(name, fn) { t.push([name, fn]); }

async function lade() {
  let h = fs.readFileSync(path.join(__dirname, "..", "build.html"), "utf8")
           .replace(/<link[^>]*fonts\.(googleapis|gstatic)[^>]*>/g, "");
  const dom = new JSDOM(h, { runScripts: "dangerously", url: "https://example.test/vierdrei/build.html" });
  await new Promise((r) => setTimeout(r, 20));
  return dom.window;
}
function fuelle(doc, r) {
  const setz = (id, v) => {
    const el = doc.getElementById(id);
    el.value = v;
    el.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
  };
  setz("nabel", r.nabel); setz("emoji", r.emoji || "🏦"); setz("autor", "Test");
  r.gruppen.forEach((g, i) => { setz("t" + i, g.titel); setz("a" + i, g.woerter[0]); setz("b" + i, g.woerter[1]); });
}
const GUT = {
  nabel: "BANK", emoji: "🏦",
  gruppen: [
    { titel: "Zum Sitzen", woerter: ["STUHL", "SESSEL"] },
    { titel: "Geld", woerter: ["SPARKASSE", "TRESOR"] },
    { titel: "Werkstatt", woerter: ["HOBEL", "ZWINGE"] },
    { titel: "Im Meer", woerter: ["RIFF", "DUENE"] }
  ]
};

test("leeres Formular ist nicht ausgabebereit", async () => {
  const w = await lade();
  assert.ok(w.document.getElementById("kopieren").disabled);
  assert.strictEqual(w.document.getElementById("ausgabe").value, "");
  w.close();
});

test("vollständiges Rätsel gibt Code frei", async () => {
  const w = await lade();
  fuelle(w.document, GUT);
  assert.ok(!w.document.getElementById("kopieren").disabled, w.document.getElementById("pruef").textContent);
  const code = w.document.getElementById("ausgabe").value;
  assert.ok(code.includes('nabel: "BANK"'), code);
  assert.ok(code.includes("NÄCHSTE_ID"), "ID-Platzhalter fehlt");
  w.close();
});

test("ein Wort in zwei Kategorien wird abgelehnt", async () => {
  const w = await lade();
  const kaputt = JSON.parse(JSON.stringify(GUT));
  kaputt.gruppen[1].woerter[0] = "STUHL";
  fuelle(w.document, kaputt);
  assert.ok(w.document.getElementById("kopieren").disabled, "durchgewunken");
  assert.ok(/mehrfach/.test(w.document.getElementById("pruef").textContent));
  w.close();
});

test("ein zu langes Wort wird abgelehnt", async () => {
  const w = await lade();
  const kaputt = JSON.parse(JSON.stringify(GUT));
  kaputt.gruppen[0].woerter[0] = "DONAUDAMPFSCHIFF";
  fuelle(w.document, kaputt);
  assert.ok(w.document.getElementById("kopieren").disabled);
  assert.ok(/zu lang/.test(w.document.getElementById("pruef").textContent));
  w.close();
});

test("ß wird beim Tippen zu SS normalisiert", async () => {
  const w = await lade();
  const r = JSON.parse(JSON.stringify(GUT));
  r.gruppen[2].woerter[1] = "straße";
  fuelle(w.document, r);
  assert.ok(w.document.getElementById("ausgabe").value.includes("STRASSE"),
    w.document.getElementById("ausgabe").value);
  w.close();
});


const KIND = {
  nabel: "BALL", emoji: "🎉",
  gruppen: [
    { titel: "Spielzeug", woerter: ["PUPPE", "TEDDY"] },
    { titel: "Beim Fußball", woerter: ["TOR", "SCHUH"] },
    { titel: "Ist rund", woerter: ["RAD", "MOND"] },
    { titel: "Kann hüpfen", woerter: ["FROSCH", "HASE"] }
  ],
  bilder: { BALL: "⚽", PUPPE: "🪆", TEDDY: "🧸", TOR: "🥅", SCHUH: "👟", RAD: "🛞", MOND: "🌕", FROSCH: "🐸", HASE: "🐰" }
};
function fuelleKind(doc, r) {
  const setz = (id, v) => {
    const el = doc.getElementById(id);
    el.value = v;
    el.dispatchEvent(new doc.defaultView.Event("input", { bubbles: true }));
  };
  setz("nabel", r.nabel); setz("bnabel", r.bilder[r.nabel]);
  setz("emoji", r.emoji); setz("autor", "Test");
  r.gruppen.forEach((g, i) => {
    setz("t" + i, g.titel);
    setz("a" + i, g.woerter[0]); setz("ea" + i, r.bilder[g.woerter[0]]);
    setz("b" + i, g.woerter[1]); setz("eb" + i, r.bilder[g.woerter[1]]);
  });
}

test("Kinderwelt zeigt vier Kategorien und Bildfelder", async () => {
  const w = await lade();
  w.document.getElementById("wKinder").click();
  assert.strictEqual(w.document.querySelectorAll("fieldset").length, 4);
  assert.ok(!w.document.getElementById("nabelBildFeld").hidden, "kein Bildfeld fürs Nabelwort");
  assert.ok(w.document.getElementById("ea0"), "kein Bildfeld für das erste Wort");
  assert.ok(w.document.getElementById("eb3"), "kein Bildfeld in der vierten Kategorie");
  assert.strictEqual(w.document.querySelectorAll("#vorschau .pv").length, 9);
  w.close();
});

test("Kinderrätsel ohne Bild wird abgelehnt", async () => {
  // Ein Kinderrätzel ohne Bilder ist für die Zielgruppe unbrauchbar.
  const w = await lade();
  w.document.getElementById("wKinder").click();
  const ohne = JSON.parse(JSON.stringify(KIND));
  ohne.bilder.RAD = "";
  fuelleKind(w.document, ohne);
  assert.ok(w.document.getElementById("kopieren").disabled, "durchgewunken");
  assert.ok(/kein Bild/.test(w.document.getElementById("pruef").textContent));
  w.close();
});

test("vollständiges Kinderrätsel gibt Code mit Bildern aus", async () => {
  const w = await lade();
  w.document.getElementById("wKinder").click();
  fuelleKind(w.document, KIND);
  assert.ok(!w.document.getElementById("kopieren").disabled, w.document.getElementById("pruef").textContent);
  const code = w.document.getElementById("ausgabe").value;
  assert.ok(/bilder: \{/.test(code), "keine Bilder im Code");
  assert.ok(code.includes('"BALL": "⚽"'), code);
  assert.strictEqual((code.match(/titel:/g) || []).length, 4, "falsche Zahl an Kategorien");
  w.close();
});

test("der Weltwechsel blendet nur die Bildfelder ein und aus", async () => {
  const w = await lade();
  assert.strictEqual(w.document.querySelectorAll("fieldset").length, 4);
  assert.strictEqual(w.document.getElementById("ea0"), null, "Bildfeld bei Erwachsenen");
  w.document.getElementById("wKinder").click();
  assert.strictEqual(w.document.querySelectorAll("fieldset").length, 4);
  assert.ok(w.document.getElementById("ea0"), "kein Bildfeld bei Kindern");
  w.document.getElementById("wErwachsen").click();
  assert.strictEqual(w.document.getElementById("ea0"), null, "Bildfeld blieb stehen");
  w.close();
});

module.exports = t;
