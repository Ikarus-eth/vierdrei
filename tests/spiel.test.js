/* Spiellogik gegen das echte index.html in jsdom. */
const assert = require("assert");
const H = require("./harness");

const t = [];
function test(name, fn) { t.push([name, fn]); }

function heutigesRaetsel(window) {
  const P = window.VMD_PUZZLES;
  const d = new Date();
  const nr = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
           - Date.UTC(2026, 0, 1) / 86400000 + 1;
  return { nr, r: P[((nr - 1) % P.length + P.length) % P.length] };
}
function gruppe(r, i) { return [r.nabel].concat(r.gruppen[i].woerter); }

test("Start zeigt neun Karten und keine gelöste Kategorie", async () => {
  const { window, doc } = await H.lade();
  assert.strictEqual(H.karten(doc).length, 9);
  assert.strictEqual(H.plaketten(doc).length, 0);
  window.close();
});

test("alle neun Karten sind genau die Rätselwörter", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  const soll = [r.nabel].concat(...r.gruppen.map((g) => g.woerter)).sort();
  const ist = H.karten(doc).map(H.wortVon).sort();
  assert.deepStrictEqual(ist, soll);
  window.close();
});

test("Prüfen ist erst bei genau drei ausgewählten Wörtern möglich", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  assert.ok(doc.getElementById("btnPruefen").disabled, "am Anfang aktiv");
  H.waehle(doc, gruppe(r, 0).slice(0, 2));
  assert.ok(doc.getElementById("btnPruefen").disabled, "bei zwei Wörtern aktiv");
  H.waehle(doc, [gruppe(r, 0)[2]]);
  assert.ok(!doc.getElementById("btnPruefen").disabled, "bei drei Wörtern gesperrt");
  window.close();
});

test("mehr als drei Wörter lassen sich nicht auswählen", async () => {
  const { window, doc } = await H.lade();
  const alle = H.karten(doc).map(H.wortVon);
  H.waehle(doc, alle.slice(0, 4));
  const aktiv = H.karten(doc).filter((k) => k.getAttribute("aria-pressed") === "true");
  assert.strictEqual(aktiv.length, 3);
  window.close();
});

test("alle neun Karten bleiben bis zum Schluss liegen", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  for (let i = 0; i < 3; i++) {
    H.waehle(doc, gruppe(r, i));
    H.pruefe(doc);
    await H.neuerTick(window, 30);
    assert.strictEqual(H.karten(doc).length, 9, "nach " + (i + 1) + " Gruppen");
  }
  await H.neuerTick(window, 1000);
  assert.strictEqual(H.karten(doc).length, 9, "nach dem Sieg");
  window.close();
});

test("gelöste Nebenwörter werden markiert und festgesetzt", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  assert.strictEqual(H.plaketten(doc).length, 1, "keine Plakette");
  r.gruppen[0].woerter.forEach((w) => {
    const k = H.karte(doc, w);
    assert.ok(k, w + " fehlt im Raster");
    assert.ok(k.classList.contains("fest"), w + " ist nicht als gelöst markiert");
    assert.ok(k.disabled, w + " ist noch anwählbar");
    assert.ok(k.style.background, w + " hat keine Stufenfarbe");
  });
  window.close();
});

test("ein gelöstes Wort lässt sich nicht mehr auswählen", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  H.karte(doc, r.gruppen[0].woerter[0]).click();
  const aktiv = H.karten(doc).filter((k) => k.getAttribute("aria-pressed") === "true");
  assert.strictEqual(aktiv.length, 0, "gelöstes Wort wurde ausgewählt");
  window.close();
});

test("das Nabelwort bleibt nach einem Treffer anwählbar", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  H.karte(doc, r.nabel).click();
  assert.strictEqual(H.karte(doc, r.nabel).getAttribute("aria-pressed"), "true");
  window.close();
});

test("die Plakette nennt die Kategorie", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  const p = H.plaketten(doc)[0].textContent;
  assert.ok(p.includes(r.gruppen[0].titel), "Titel fehlt");
  window.close();
});

test("falsche Auswahl zählt einen Fehler und räumt die Auswahl nicht ab", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, [r.nabel, r.gruppen[0].woerter[0], r.gruppen[1].woerter[0]]);
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  assert.ok(doc.getElementById("fehler").textContent.includes("1"), "Fehler nicht gezählt");
  assert.strictEqual(H.plaketten(doc).length, 0);
  assert.strictEqual(H.karten(doc).length, 9);
  assert.ok(H.meldung(doc).length > 0, "keine Rückmeldung");
  window.close();
});

test("zwei von drei richtig ergibt den Fast-Hinweis", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, [r.nabel, r.gruppen[0].woerter[0], r.gruppen[1].woerter[0]]);
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  assert.ok(/Fast/.test(H.meldung(doc)), "Meldung war: " + H.meldung(doc));
  window.close();
});

test("drei gelöste Gruppen lösen die vierte automatisch auf", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  for (let i = 0; i < 3; i++) {
    H.waehle(doc, gruppe(r, i));
    H.pruefe(doc);
    await H.neuerTick(window, 30);
  }
  await H.neuerTick(window, 1000);
  assert.strictEqual(H.plaketten(doc).length, 4, "vierte Gruppe nicht aufgelöst");
  assert.ok(H.offen(doc), "Ergebnis wurde nicht angezeigt");
  window.close();
});

test("das Ergebnis nennt das Nabelwort und eine Punktzahl über null", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  for (let i = 0; i < 3; i++) {
    H.waehle(doc, gruppe(r, i));
    H.pruefe(doc);
    await H.neuerTick(window, 30);
  }
  await H.neuerTick(window, 1000);
  const txt = doc.getElementById("panel").textContent;
  assert.ok(txt.includes(r.nabel), "Nabelwort fehlt im Ergebnis");
  const m = txt.match(/Punkte(\d+)/);
  assert.ok(m, "keine Punktzeile gefunden");
  assert.ok(+m[1] >= 100, "Punkte zu niedrig: " + m[1]);
  window.close();
});

test("Fehlversuche schmälern die Punkte", async () => {
  async function spiele(mitFehler) {
    const { window, doc } = await H.lade();
    const { r } = heutigesRaetsel(window);
    if (mitFehler) {
      H.waehle(doc, [r.nabel, r.gruppen[0].woerter[0], r.gruppen[1].woerter[0]]);
      H.pruefe(doc);
      await H.neuerTick(window, 30);
      doc.getElementById("btnLeeren").click();
    }
    for (let i = 0; i < 3; i++) {
      H.waehle(doc, gruppe(r, i));
      H.pruefe(doc);
      await H.neuerTick(window, 30);
    }
    await H.neuerTick(window, 1000);
    const p = +doc.getElementById("panel").textContent.match(/Punkte(\d+)/)[1];
    window.close();
    return p;
  }
  const sauber = await spiele(false);
  const patzer = await spiele(true);
  assert.ok(patzer < sauber, "Fehler kostete nichts: " + patzer + " vs " + sauber);
});

test("im Schwer-Modus ist das Nabelwort vor dem ersten Treffer nicht markiert", async () => {
  const { window, doc } = await H.lade();
  assert.strictEqual(doc.querySelectorAll("#raster .card.hub").length, 0);
  window.close();
});

test("Leicht-Modus markiert das Nabelwort sofort", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  doc.getElementById("modeLeicht").click();
  const hub = doc.querySelectorAll("#raster .card.hub");
  assert.strictEqual(hub.length, 1, "kein markiertes Nabelwort");
  assert.strictEqual(H.wortVon(hub[0]), r.nabel);
  window.close();
});

test("nach der ersten Gruppe ist das Nabelwort noch nicht markiert", async () => {
  // Es trägt dann die Farbe dieser Gruppe und sieht aus wie die beiden anderen
  // gelösten Karten — nur so bleibt es im Schwer-Modus eine Runde länger offen.
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  assert.strictEqual(doc.querySelectorAll("#raster .card.hub").length, 0, "zu früh markiert");
  const k = H.karte(doc, r.nabel);
  assert.ok(k.style.background, "Nabelwort trägt keine Stufenfarbe");
  assert.ok(!k.disabled, "Nabelwort wurde festgesetzt");
  window.close();
});

test("nach der zweiten Gruppe ist das Nabelwort markiert", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  for (let i = 0; i < 2; i++) {
    H.waehle(doc, gruppe(r, i));
    H.pruefe(doc);
    await H.neuerTick(window, 30);
  }
  const hub = doc.querySelectorAll("#raster .card.hub");
  assert.strictEqual(hub.length, 1, "nicht markiert");
  assert.strictEqual(H.wortVon(hub[0]), r.nabel);
  window.close();
});

test("der Modus lässt sich nach dem ersten Treffer nicht mehr wechseln", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  doc.getElementById("modeLeicht").click();
  assert.strictEqual(doc.getElementById("modeLeicht").getAttribute("aria-pressed"), "false");
  window.close();
});

test("Mischen ändert die Reihenfolge, nicht den Kartensatz", async () => {
  const { window, doc } = await H.lade();
  const vorher = H.karten(doc).map(H.wortVon);
  doc.getElementById("btnMischen").click();
  const nachher = H.karten(doc).map(H.wortVon);
  assert.deepStrictEqual(nachher.slice().sort(), vorher.slice().sort(), "Kartensatz verändert");
  window.close();
});

test("Mischen lässt gelöste Karten auf ihrem Platz", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  const platz = (w) => H.karten(doc).findIndex((k) => H.wortVon(k) === w);
  const vorher = r.gruppen[0].woerter.map(platz);
  doc.getElementById("btnMischen").click();
  assert.deepStrictEqual(r.gruppen[0].woerter.map(platz), vorher, "gelöste Karte ist gewandert");
  window.close();
});

test("Auswahl leeren hebt alle Markierungen auf", async () => {
  const { window, doc } = await H.lade();
  const { r } = heutigesRaetsel(window);
  H.waehle(doc, gruppe(r, 0));
  doc.getElementById("btnLeeren").click();
  assert.strictEqual(H.karten(doc).filter((k) => k.getAttribute("aria-pressed") === "true").length, 0);
  window.close();
});

test("ein gelöstes Rätsel wird gespeichert und beim Neuladen wiederhergestellt", async () => {
  // Persistenz ist der Grund, warum ein halb gelöstes Rätsel einen App-Neustart
  // überlebt — ohne sie beginnt jedes Öffnen wieder bei neun Karten.
  const url = "https://persist.test/vierdrei/";
  const a = await H.lade({ url });
  const { r } = heutigesRaetsel(a.window);
  H.waehle(a.doc, gruppe(r, 0));
  H.pruefe(a.doc);
  await H.neuerTick(a.window, 30);
  const gespeichert = a.window.localStorage.getItem("vmd.spiel." + heutigesRaetsel(a.window).nr);
  assert.ok(gespeichert, "nichts gespeichert");
  assert.ok(JSON.parse(gespeichert).geloest.length === 1, "Lösungsstand fehlt");
  a.window.close();
});

test("Anleitung, Punkte, Statistik und Archiv lassen sich öffnen", async () => {
  const { window, doc } = await H.lade();
  ["btnHilfe", "btnPunkte", "btnStat", "btnArchiv2"].forEach((id) => {
    doc.getElementById(id).click();
    assert.ok(H.offen(doc), id + " öffnet nichts");
    assert.ok(doc.getElementById("panel").textContent.trim().length > 20, id + " ist leer");
    doc.getElementById("x").click();
  });
  window.close();
});

test("das Archiv listet bis zu 30 Rätsel", async () => {
  const { window, doc } = await H.lade();
  doc.getElementById("btnArchiv2").click();
  const heute = heutigesRaetsel(window).nr;
  assert.strictEqual(doc.querySelectorAll(".archiv button").length, Math.min(30, heute));
  window.close();
});

function direktlink(r) {
  const j = JSON.stringify(r);
  return "https://example.test/vierdrei/#p=" +
    Buffer.from(j, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const GAST = {
  nabel: "PROBE", emoji: "🧪", autor: "Test",
  gruppen: [
    { titel: "Alpha", woerter: ["AA", "AB"] },
    { titel: "Beta", woerter: ["BA", "BB"] },
    { titel: "Gamma", woerter: ["GA", "GB"] },
    { titel: "Delta", woerter: ["DA", "DB"] }
  ]
};

test("ein Direktlink aus dem Baukasten spielt das mitgelieferte Rätsel", async () => {
  const { window, doc } = await H.lade({ url: direktlink(GAST) });
  assert.strictEqual(H.karten(doc).length, 9);
  assert.ok(H.karte(doc, "PROBE"), "Nabelwort des Direktlinks fehlt");
  assert.ok(H.karte(doc, "GB"), "Wort aus dem Direktlink fehlt");
  assert.ok(doc.getElementById("nr").textContent.includes("Direktlink"));
  window.close();
});

test("ein Direktlink wird weder gespeichert noch in der Statistik gezählt", async () => {
  // Sonst überschreibt ein geteiltes Rätsel den Tagesstand oder bläht die Serie auf.
  const { window, doc } = await H.lade({ url: direktlink(GAST) });
  for (let i = 0; i < 3; i++) {
    H.waehle(doc, ["PROBE"].concat(GAST.gruppen[i].woerter));
    H.pruefe(doc);
    await H.neuerTick(window, 30);
  }
  await H.neuerTick(window, 1000);
  assert.ok(H.offen(doc), "Ergebnis fehlt");
  assert.strictEqual(window.localStorage.getItem("vmd.spiel.0"), null, "Gastrunde wurde gespeichert");
  const st = JSON.parse(window.localStorage.getItem("vmd.stats") || "null");
  assert.ok(!st || st.gespielt === 0, "Gastrunde landete in der Statistik");
  window.close();
});

test("jedes Rätsel im Datensatz ist von Anfang bis Ende lösbar", async () => {
  // Fängt Datenfehler, die der reine Datentest nicht sieht: etwa ein Wort, das
  // im Raster fehlt, weil es unter zwei Gruppen doppelt geführt wird.
  const { window, doc } = await H.lade();
  const P = window.VMD_PUZZLES;
  window.close();
  for (let idx = 0; idx < P.length; idx++) {
    const r = P[idx];
    const felder = [r.nabel].concat(...r.gruppen.map((g) => g.woerter));
    assert.strictEqual(new Set(felder).size, 9, r.nabel);
    for (let i = 0; i < 4; i++) {
      const g = gruppe(r, i);
      assert.strictEqual(new Set(g).size, 3, r.nabel + " Gruppe " + (i + 1));
      g.forEach((w) => assert.ok(felder.includes(w), r.nabel + ": " + w + " fehlt im Raster"));
    }
  }
});



/* ---------------- Kinderwelt ---------------- */

function heutigesKinderraetsel(window) {
  const P = window.VMD_KINDER;
  const d = new Date();
  const nr = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
           - Date.UTC(2026, 0, 1) / 86400000 + 1;
  return { nr, r: P[((nr - 1) % P.length + P.length) % P.length] };
}

test("ohne Wahl erscheint der Startbildschirm über dem Spiel", async () => {
  const { window, doc } = await H.lade();
  assert.ok(H.startOffen(doc), "Startbildschirm fehlt");
  assert.strictEqual(doc.querySelectorAll("#start [data-welt]").length, 2);
  window.close();
});

test("Kinderwelt zeigt neun Karten und vier Kategorien", async () => {
  const { window, doc } = await H.lade({ welt: "kinder" });
  const { r } = heutigesKinderraetsel(window);
  assert.ok(!H.startOffen(doc), "Startbildschirm bleibt offen");
  assert.strictEqual(H.karten(doc).length, 9);
  assert.strictEqual(r.gruppen.length, 4);
  const soll = [r.nabel].concat(...r.gruppen.map((g) => g.woerter)).sort();
  assert.deepStrictEqual(H.karten(doc).map(H.wortVon).sort(), soll);
  window.close();
});

test("jede Kinderkarte trägt ein Bild", async () => {
  const { window, doc } = await H.lade({ welt: "kinder" });
  H.karten(doc).forEach((k) => {
    const b = k.querySelector(".bild");
    assert.ok(b && b.textContent.trim().length, H.wortVon(k) + " hat kein Bild");
  });
  window.close();
});

test("das Nabelwort ist auch für Kinder erst ab der zweiten Gruppe markiert", async () => {
  const { window, doc } = await H.lade({ welt: "kinder" });
  const { r } = heutigesKinderraetsel(window);
  assert.strictEqual(doc.querySelectorAll("#raster .card.hub").length, 0, "sofort markiert");
  H.waehle(doc, [r.nabel].concat(r.gruppen[0].woerter));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  assert.strictEqual(doc.querySelectorAll("#raster .card.hub").length, 0, "nach einer Gruppe markiert");
  H.waehle(doc, [r.nabel].concat(r.gruppen[1].woerter));
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  const hub = doc.querySelectorAll("#raster .card.hub");
  assert.strictEqual(hub.length, 1, "nach zwei Gruppen nicht markiert");
  assert.strictEqual(H.wortVon(hub[0]), r.nabel);
  window.close();
});

test("ein geerbtes Leicht aus der Erwachsenenwelt verrät Kindern nichts", async () => {
  // Die Modusumschaltung ist bei Kindern versteckt; ohne die Zwangsumstellung
  // auf "schwer" bliebe ein früher gewähltes "leicht" wirksam.
  const { window, doc } = await H.lade({ speicher: { "vmd.welt": "kinder", "vmd.opt": { modus: "leicht", ton: true } } });
  assert.strictEqual(doc.querySelectorAll("#raster .card.hub").length, 0);
  window.close();
});

test("Kinder spielen ohne Uhr, ohne Fehlerzähler und ohne Schwierigkeitswahl", async () => {
  const { window, doc } = await H.lade({ welt: "kinder" });
  const { r } = heutigesKinderraetsel(window);
  assert.strictEqual(doc.getElementById("uhr").style.display, "none");
  assert.strictEqual(doc.getElementById("modeLeicht").parentNode.style.display, "none");
  H.waehle(doc, [r.nabel, r.gruppen[0].woerter[0], r.gruppen[1].woerter[0]]);
  H.pruefe(doc);
  await H.neuerTick(window, 30);
  assert.strictEqual(doc.getElementById("fehler").textContent.trim(), "", "Fehler werden gezählt");
  window.close();
});

test("drei gelöste Kindergruppen lösen die vierte automatisch auf", async () => {
  const { window, doc } = await H.lade({ welt: "kinder" });
  const { r } = heutigesKinderraetsel(window);
  for (let i = 0; i < 3; i++) {
    H.waehle(doc, [r.nabel].concat(r.gruppen[i].woerter));
    H.pruefe(doc);
    await H.neuerTick(window, 30);
  }
  await H.neuerTick(window, 1000);
  assert.strictEqual(H.plaketten(doc).length, 4, "vierte Gruppe nicht aufgelöst");
  assert.ok(H.offen(doc), "kein Ergebnis");
  const txt = doc.getElementById("panel").textContent;
  assert.ok(/Geschafft/.test(txt), "kein Kinder-Ergebnis: " + txt.slice(0, 60));
  assert.ok(/⭐⭐⭐⭐/.test(txt), "nicht vier Sterne");
  assert.ok(!/Punkte/.test(txt), "Punkte im Kinder-Ergebnis");
  window.close();
});

test("Kinder- und Erwachsenenstand liegen getrennt", async () => {
  // Sonst überschreibt das Kind den Tagesstand des Erwachsenen und umgekehrt.
  const url = "https://welten.test/vierdrei/";
  const a = await H.lade({ url, welt: "kinder" });
  const { r, nr } = heutigesKinderraetsel(a.window);
  H.waehle(a.doc, [r.nabel].concat(r.gruppen[0].woerter));
  H.pruefe(a.doc);
  await H.neuerTick(a.window, 30);
  assert.ok(a.window.localStorage.getItem("vmd.kinder.spiel." + nr), "Kinderstand fehlt");
  assert.strictEqual(a.window.localStorage.getItem("vmd.spiel." + nr), null,
    "Kinderstand landete im Erwachsenenfach");
  assert.strictEqual(a.window.localStorage.getItem("vmd.stats"), null,
    "Kinderpartie zählte in der Erwachsenenstatistik");
  a.window.close();
});

test("die getroffene Wahl wird gespeichert", async () => {
  const { window } = await H.lade({ welt: "kinder" });
  assert.strictEqual(window.localStorage.getItem("vmd.welt"), '"kinder"');
  window.close();
});

test("eine gemerkte Welt startet ohne Startbildschirm", async () => {
  const { window, doc } = await H.lade({ speicher: { "vmd.welt": "kinder" } });
  assert.ok(!H.startOffen(doc), "Startbildschirm trotz gemerkter Welt");
  assert.ok(doc.body.classList.contains("kinder"), "falsche Welt");
  assert.strictEqual(H.karten(doc).length, 9);
  window.close();
});

test("der Weltwechsler öffnet den Startbildschirm wieder", async () => {
  const { window, doc } = await H.lade({ welt: "erwachsen" });
  doc.getElementById("btnWelt").click();
  assert.ok(H.startOffen(doc));
  doc.querySelector('#start [data-welt="kinder"]').click();
  await H.neuerTick(window, 20);
  assert.strictEqual(H.karten(doc).length, 9);
  assert.ok(doc.querySelector("#raster .card .bild"), "keine Bilder nach dem Wechsel");
  window.close();
});

test("die Anleitung passt sich der Welt an", async () => {
  const k = await H.lade({ welt: "kinder" });
  k.doc.getElementById("btnHilfe").click();
  assert.ok(/goldenen Rand/.test(k.doc.getElementById("panel").textContent));
  assert.ok(/vier Gruppen/.test(k.doc.getElementById("panel").textContent));
  k.window.close();
  const e = await H.lade({ welt: "erwachsen" });
  e.doc.getElementById("btnHilfe").click();
  assert.ok(/Nabelwort/.test(e.doc.getElementById("panel").textContent));
  e.window.close();
});

test("jedes Kinderrätsel ist vollständig und lösbar", async () => {
  const { window } = await H.lade({ welt: "kinder" });
  const P = window.VMD_KINDER;
  window.close();
  P.forEach((r) => {
    const felder = [r.nabel].concat(...r.gruppen.map((g) => g.woerter));
    assert.strictEqual(new Set(felder).size, 9, r.nabel);
    r.gruppen.forEach((g, i) => {
      const drei = [r.nabel].concat(g.woerter);
      assert.strictEqual(new Set(drei).size, 3, r.nabel + " Gruppe " + (i + 1));
      drei.forEach((w) => assert.ok(felder.includes(w), r.nabel + ": " + w + " fehlt"));
    });
  });
});

module.exports = t;
