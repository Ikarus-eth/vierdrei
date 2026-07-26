/* Prüft die Rätseldaten. Ein kaputtes Rätsel ist der wahrscheinlichste Fehler
 * in diesem Projekt — deshalb ist das der ausführlichste Test. */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const win = {};
new Function("window", fs.readFileSync(path.join(__dirname, "..", "puzzles.js"), "utf8"))(win);
const P = win.VMD_PUZZLES;

const t = [];
function test(name, fn) { t.push([name, fn]); }

test("mindestens 14 Rätsel vorhanden", () => {
  assert.ok(P.length >= 14, "nur " + P.length + " Rätsel");
});

test("fortlaufende, eindeutige IDs ab 1", () => {
  P.forEach((r, i) => assert.strictEqual(r.id, i + 1, "ID-Lücke bei Index " + i));
});

test("jedes Rätsel hat genau vier Gruppen", () => {
  P.forEach((r) => assert.strictEqual(r.gruppen.length, 4, r.nabel + ": " + r.gruppen.length + " Gruppen"));
});

test("jede Gruppe hat genau zwei Wörter neben dem Nabelwort", () => {
  P.forEach((r) => r.gruppen.forEach((g) =>
    assert.strictEqual(g.woerter.length, 2, r.nabel + " / " + g.titel)));
});

test("jedes Rätsel hat genau neun verschiedene Wörter", () => {
  P.forEach((r) => {
    const w = [r.nabel].concat(...r.gruppen.map((g) => g.woerter));
    assert.strictEqual(w.length, 9, r.nabel + ": " + w.length + " Wörter");
    assert.strictEqual(new Set(w).size, 9, r.nabel + ": doppeltes Wort -> " + w.join(","));
  });
});

test("kein Nebenwort taucht in zwei Gruppen auf", () => {
  // Das ist die Kernregel: nur das Nabelwort ist mehrdeutig. Sonst hat das
  // Rätsel mehr als eine gültige Lösung.
  P.forEach((r) => {
    const zahl = {};
    r.gruppen.forEach((g) => g.woerter.forEach((w) => { zahl[w] = (zahl[w] || 0) + 1; }));
    Object.keys(zahl).forEach((w) =>
      assert.strictEqual(zahl[w], 1, r.nabel + ": '" + w + "' steht in mehreren Gruppen"));
  });
});

test("das Nabelwort steht in keiner Gruppenliste", () => {
  // Es wird beim Rendern automatisch ergänzt; doppelt gelistet ergäbe 8 Wörter.
  P.forEach((r) => r.gruppen.forEach((g) =>
    assert.ok(!g.woerter.includes(r.nabel), r.nabel + " doppelt in '" + g.titel + "'")));
});

test("Titel sind vorhanden, kurz und eindeutig je Rätsel", () => {
  P.forEach((r) => {
    const titel = r.gruppen.map((g) => g.titel);
    titel.forEach((x) => {
      assert.ok(x && x.trim().length > 1, r.nabel + ": leerer Titel");
      assert.ok(x.length <= 34, r.nabel + ": Titel zu lang für die Plakette -> " + x);
    });
    assert.strictEqual(new Set(titel).size, 4, r.nabel + ": doppelter Titel");
  });
});

test("Wörter sind Großbuchstaben und passen auf eine Karte", () => {
  P.forEach((r) => {
    [r.nabel].concat(...r.gruppen.map((g) => g.woerter)).forEach((w) => {
      assert.strictEqual(w, w.toUpperCase(), r.nabel + ": '" + w + "' nicht in Versalien");
      assert.ok(!/\s/.test(w), r.nabel + ": '" + w + "' enthält ein Leerzeichen");
      assert.ok(w.length <= 13, r.nabel + ": '" + w + "' ist zu lang für eine Karte");
      assert.ok(!/ß/.test(w), r.nabel + ": '" + w + "' — ß wird in Versalien zu SS");
    });
  });
});

test("jedes Rätsel hat ein Emoji für das Nabelwort-Feuerwerk", () => {
  P.forEach((r) => assert.ok(r.emoji && r.emoji.length, r.nabel + ": kein Emoji"));
});

module.exports = t;
