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
module.exports = t;
