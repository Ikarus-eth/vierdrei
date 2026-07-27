# VIER×DREI

Tägliches deutsches Worträtsel. Neun Wörter, vier Kategorien zu je drei Wörtern,
**ein Wort steht in allen vier** — das Nabelwort.

Spielprinzip nach **4×3 von Hank Green** (`hankgreen.com/fourbythree`).
Eigener Code, eigene Rätsel, deutsche Oberfläche.

Läuft als statische Seite, kein Build-Schritt, kein Server, keine Abhängigkeit
zur Laufzeit. Lässt sich auf dem iPad zum Homescreen hinzufügen (PWA).

## Aufbau

| Datei | was |
|---|---|
| `index.html` | das ganze Spiel — HTML, CSS, JS in einer Datei. **Hier wird editiert.** |
| `puzzles.js` | die Rätsel. Setzt `window.VMD_PUZZLES`. Einzige Datei, die für neue Rätsel angefasst wird. |
| `build.html` | Baukasten für neue Rätsel: prüft live, gibt Code und Direktlink aus |
| `sw.js` | Service Worker, Netz zuerst, `cache:"no-store"` |
| `manifest.json`, `icon-*.png` | PWA-Metadaten und Symbole |
|  `tests/` | Testsuite, `tests/run.sh` |

`index.html` ist **nicht** generiert — es gibt keinen Bundler. Direkt editieren ist richtig.

## Befehle

```bash
./tests/run.sh          # 43 Tests: Rätseldaten, Spiellogik, Baukasten
python3 -m http.server  # lokal ansehen unter http://localhost:8000
```

`tests/run.sh` installiert `jsdom` beim ersten Lauf selbst. Sonst keine Abhängigkeiten.

## Spielregeln im Code

- Jede richtige Dreiergruppe enthält zwangsläufig das Nabelwort. Alle neun Karten
  bleiben von Anfang bis Ende liegen; gelöste Nebenwörter werden in der Farbe
  ihrer Kategorie eingefärbt, bekommen die Stufenziffer und werden festgesetzt.
  Sind drei Gruppen gelöst, löst sich die vierte von selbst auf.
- Das Nabelwort wird im Schwer-Modus **erst ab der zweiten** gelösten Kategorie
  markiert. Nach der ersten trägt es deren Farbe und sieht aus wie eine gelöste
  Karte — bleibt aber anwählbar. Es früher zu markieren nimmt dem Rätsel eine
  ganze Runde Spannung; wer die Karten stattdessen verschwinden lässt, verrät es
  ebenfalls sofort.
- Mischen rührt nur die freien Karten um. Gelöste bleiben auf ihrem Platz, sonst
  zerfällt das Farbmuster der bereits gelösten Gruppen.
- **Leicht** markiert das Nabelwort von Anfang an, kostet dafür 25 % der Punkte.
  **Schwer** verrät nichts. Der Modus lässt sich nach dem ersten Treffer nicht
  mehr wechseln — sonst könnte man ihn nach dem ersten Treffer zurückstellen und
  den Abzug umgehen.
- Punkte: gelöst +100, unter 90 s +25, unter 3 min +10, Stufe 4 zuerst +25,
  Serie +1 je Tag; Fehlversuch −15, Fehlversuch bei nur noch zwei offenen
  Kategorien −30, Nabelwort in allen vier Gruppen zuletzt getippt −100.
  Nie unter null.
- Die Farben (gelb → grün → blau → lila) kodieren die Schwierigkeit der
  Kategorie, nicht die Lösung. Jede Plakette trägt zusätzlich die Ziffer 1–4,
  damit die Stufe nicht allein an der Farbe hängt.

## Rätsel anlegen

`build.html` öffnen, ausfüllen, „Code kopieren“, ans Ende der Liste in
`puzzles.js` hängen, `id` hochzählen, `./tests/run.sh`.

„Direktlink kopieren“ packt das Rätsel base64-kodiert in den URL-Hash
(`index.html#p=…`). So lässt sich ein Rätsel weitergeben, ohne es zu deployen.
Direktlink-Runden zählen nicht in die Statistik und überschreiben den
Tagesstand nicht.

Das Tagesrätsel ergibt sich aus dem Datum: `Rätsel[(Nr − 1) mod Anzahl]`,
Nr. 1 = 01.01.2026. Die Liste wiederholt sich also, wenn sie durch ist —
aktuell nach 21 Tagen. Nachlegen, bevor es so weit ist.

## Fallstricke — nicht rückgängig machen

- **Kein Nebenwort darf in zwei Kategorien passen.** Nur das Nabelwort ist
  mehrdeutig. Sonst hat das Rätsel mehr als eine gültige Lösung und das Spiel
  akzeptiert eine Gruppe, die der Spieler nie so gemeint hat.
  `tests/daten.test.js` prüft das; der Test ist der eigentliche Grund für die
  Suite.
- **`ß` gibt es auf den Karten nicht.** Karten stehen in Versalien, und in
  Versalien wird `ß` zu `SS`. Ein `ß` in `puzzles.js` würde je nach Schrift und
  Browser unterschiedlich gerendert. Der Datentest lehnt es ab.
- **Wörter über 13 Zeichen passen nicht auf eine Karte.** Auf einem 360-px-Gerät
  bleiben pro Karte gut 100 px. Der Datentest lehnt längere ab.
- **Service Worker: `cache:"no-store"` beim `fetch` und `updateViaCache:"none"`
  bei der Registrierung.** Ohne beides liefert iOS nach einem Deploy tagelang
  weiter die alte Fassung aus, und der Deploy sieht aus, als hätte er nichts
  getan.
- **Gastrunden aus Direktlinks werden nicht gespeichert.** Sie liefen sonst unter
  demselben Speicherschlüssel und ein geteiltes Rätsel würde den Tagesstand
  überschreiben.
- **Die Statistik zeigt keine Gewinnquote.** Es gibt keine Niederlage — Fehler
  kosten Punkte, beenden aber nichts. Eine Quote wäre immer 100 %. Stattdessen
  Ø Punkte.

## Deploy

Statisch. Alle Dateien im Wurzelverzeichnis des Zweigs, den GitHub Pages
ausliefert. Ein atomarer Commit über die Git-Data-API (blobs → tree → commit →
ref), damit die Seite nie halb aktualisiert ist. Pages baut in etwa einer Minute.

`node_modules/` gehört nicht ins Repo — nur  `tests/` braucht es, und
`tests/run.sh` installiert es selbst.
