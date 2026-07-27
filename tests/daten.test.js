/* Prüft die Rätseldaten. Ein kaputtes Rätsel ist der wahrscheinlichste Fehler
 * in diesem Projekt — deshalb ist das der ausführlichste Test. */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const win = {};
new Function("window", fs.readFileSync(path.join(__dirname, "..", "puzzles.js"), "utf8"))(win);
new Function("window", fs.readFileSync(path.join(__dirname, "..", "puzzles-kinder.js"), "utf8"))(win);

// Beide Kataloge werden gegen dieselben Regeln geprüft. Sie unterscheiden sich
// nur in der Zahl der Kategorien und darin, dass Kinderrätsel Bilder brauchen.
const KATALOGE = [
  { name: "Erwachsene", liste: win.VMD_PUZZLES, gruppen: 4, bilder: false, min: 14 },
  { name: "Kinder", liste: win.VMD_KINDER, gruppen: 3, bilder: true, min: 10 }
];
const P = win.VMD_PUZZLES;
const alleRaetsel = KATALOGE.flatMap((k) => k.liste.map((r) => [k, r]));
function jedes(fn) { alleRaetsel.forEach(([k, r]) => fn(r, k)); }
function bez(k, r) { return k.name + "/" + r.nabel; }

const t = [];
function test(name, fn) { t.push([name, fn]); }

test("beide Kataloge haben genug Rätsel für zwei Wochen", () => {
  KATALOGE.forEach((k) =>
    assert.ok(k.liste.length >= k.min, k.name + ": nur " + k.liste.length + " Rätsel"));
});

test("fortlaufende, eindeutige IDs ab 1", () => {
  KATALOGE.forEach((k) =>
    k.liste.forEach((r, i) => assert.strictEqual(r.id, i + 1, k.name + ": ID-Lücke bei Index " + i)));
});

test("Erwachsene haben vier Gruppen, Kinder drei", () => {
  jedes((r, k) => assert.strictEqual(r.gruppen.length, k.gruppen, bez(k, r) + ": " + r.gruppen.length));
});

test("jede Karte im Kinderrätsel hat ein Bild", () => {
  // Ohne Bild ist das Spiel für ein Kind, das noch nicht sicher liest, zu.
  win.VMD_KINDER.forEach((r) => {
    assert.ok(r.bilder, r.nabel + ": keine Bilder");
    [r.nabel].concat(...r.gruppen.map((g) => g.woerter)).forEach((w) =>
      assert.ok(r.bilder[w], r.nabel + ": kein Bild für " + w));
    assert.strictEqual(Object.keys(r.bilder).length, 7, r.nabel + ": Bilder passen nicht zu sieben Karten");
  });
});

test("jede Gruppe hat genau zwei Wörter neben dem Nabelwort", () => {
  jedes((r, k) => r.gruppen.forEach((g) =>
    assert.strictEqual(g.woerter.length, 2, bez(k, r) + " / " + g.titel)));
});

test("jedes Rätsel hat lauter verschiedene Wörter, Nabelwort plus zwei je Gruppe", () => {
  jedes((r, k) => {
    const soll = 1 + 2 * k.gruppen;
    const w = [r.nabel].concat(...r.gruppen.map((g) => g.woerter));
    assert.strictEqual(w.length, soll, bez(k, r) + ": " + w.length + " statt " + soll);
    assert.strictEqual(new Set(w).size, soll, bez(k, r) + ": doppeltes Wort -> " + w.join(","));
  });
});

test("kein Nebenwort taucht in zwei Gruppen auf", () => {
  // Das ist die Kernregel: nur das Nabelwort ist mehrdeutig. Sonst hat das
  // Rätsel mehr als eine gültige Lösung.
  jedes((r, k) => {
    const zahl = {};
    r.gruppen.forEach((g) => g.woerter.forEach((w) => { zahl[w] = (zahl[w] || 0) + 1; }));
    Object.keys(zahl).forEach((w) =>
      assert.strictEqual(zahl[w], 1, bez(k, r) + ": '" + w + "' steht in mehreren Gruppen"));
  });
});

test("das Nabelwort steht in keiner Gruppenliste", () => {
  // Es wird beim Rendern automatisch ergänzt; doppelt gelistet ergäbe 8 Wörter.
  jedes((r, k) => r.gruppen.forEach((g) =>
    assert.ok(!g.woerter.includes(r.nabel), bez(k, r) + " doppelt in '" + g.titel + "'")));
});

test("Titel sind vorhanden, kurz und eindeutig je Rätsel", () => {
  jedes((r, k) => {
    const titel = r.gruppen.map((g) => g.titel);
    titel.forEach((x) => {
      assert.ok(x && x.trim().length > 1, bez(k, r) + ": leerer Titel");
      assert.ok(x.length <= 34, bez(k, r) + ": Titel zu lang für die Plakette -> " + x);
    });
    assert.strictEqual(new Set(titel).size, k.gruppen, bez(k, r) + ": doppelter Titel");
  });
});

test("Wörter sind Großbuchstaben und passen auf eine Karte", () => {
  jedes((r, k) => {
    [r.nabel].concat(...r.gruppen.map((g) => g.woerter)).forEach((w) => {
      assert.strictEqual(w, w.toUpperCase(), bez(k, r) + ": '" + w + "' nicht in Versalien");
      assert.ok(!/\s/.test(w), bez(k, r) + ": '" + w + "' enthält ein Leerzeichen");
      assert.ok(w.length <= 13, bez(k, r) + ": '" + w + "' ist zu lang für eine Karte");
      assert.ok(!/ß/.test(w), bez(k, r) + ": '" + w + "' — ß wird in Versalien zu SS");
    });
  });
});

test("jedes Rätsel hat ein Emoji für das Nabelwort-Feuerwerk", () => {
  jedes((r, k) => assert.ok(r.emoji && r.emoji.length, bez(k, r) + ": kein Emoji"));
});

module.exports = t;
