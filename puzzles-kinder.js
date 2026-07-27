/* VIER x DREI - Kinderrätsel
 *
 * Gleicher Aufbau wie puzzles.js: neun Karten, vier Kategorien, ein Nabelwort
 * in allen vier. Das Nabelwort wird auch hier erst ab der zweiten gelösten
 * Kategorie markiert.
 *
 * Unterschied zur Erwachsenenfassung: jedes Wort hat ein Bild. Deshalb
 * funktioniert das Spiel auch, wenn das Lesen noch hakt. Dazu kommen einfachere
 * Wörter, keine Uhr, keine Punkte und Vorlesen beim Antippen.
 *
 * Struktur: { id, nabel, emoji, autor, bilder: { WORT: "🙂", ... }, gruppen: [...] }
 * "bilder" braucht einen Eintrag für alle neun Wörter — der Datentest besteht
 * darauf, weil ein Kinderrätsel ohne Bilder seinen Zweck verfehlt.
 *
 * Wörter aus dem Grundschulwortschatz. Kategorien beschreiben etwas, das man
 * sehen oder anfassen kann — keine Wortspiele auf zweite Wortbedeutungen.
 */
window.VMD_KINDER = [
  {
    id: 1, nabel: "BALL", emoji: "⚽", autor: "Ikarus",
    bilder: { BALL: "⚽", PUPPE: "🪆", TEDDY: "🧸", TOR: "🥅", SCHUH: "👟", RAD: "🛞", MOND: "🌕", FROSCH: "🐸", HASE: "🐰" },
    gruppen: [
      { titel: "Spielzeug",     woerter: ["PUPPE", "TEDDY"] },
      { titel: "Beim Fußball",  woerter: ["TOR", "SCHUH"] },
      { titel: "Ist rund",      woerter: ["RAD", "MOND"] },
      { titel: "Kann hüpfen",   woerter: ["FROSCH", "HASE"] }
    ]
  },
  {
    id: 2, nabel: "KATZE", emoji: "🐈", autor: "Ikarus",
    bilder: { KATZE: "🐈", HUND: "🐕", FISCH: "🐠", KISSEN: "🛏️", WOLLE: "🧶", AFFE: "🐒", "EICHHÖRNCHEN": "🐿️", ADLER: "🦅", KRABBE: "🦀" },
    gruppen: [
      { titel: "Haustier",      woerter: ["HUND", "FISCH"] },
      { titel: "Ist weich",     woerter: ["KISSEN", "WOLLE"] },
      { titel: "Klettert gern", woerter: ["AFFE", "EICHHÖRNCHEN"] },
      { titel: "Hat Krallen",   woerter: ["ADLER", "KRABBE"] }
    ]
  },
  {
    id: 3, nabel: "SONNE", emoji: "☀️", autor: "Ikarus",
    bilder: { SONNE: "☀️", WOLKE: "☁️", REGENBOGEN: "🌈", BANANE: "🍌", ZITRONE: "🍋", BALL: "⚽", RAD: "🛞", FEUER: "🔥", SUPPE: "🍲" },
    gruppen: [
      { titel: "Am Himmel", woerter: ["WOLKE", "REGENBOGEN"] },
      { titel: "Ist gelb",  woerter: ["BANANE", "ZITRONE"] },
      { titel: "Ist rund",  woerter: ["BALL", "RAD"] },
      { titel: "Ist heiß",  woerter: ["FEUER", "SUPPE"] }
    ]
  },
  {
    id: 4, nabel: "WASSER", emoji: "💧", autor: "Ikarus",
    bilder: { WASSER: "💧", MILCH: "🥛", SAFT: "🧃", FISCH: "🐟", WELLE: "🌊", SEIFE: "🧼", "ZAHNBÜRSTE": "🪥", REGEN: "🌧️", SCHNEE: "❄️" },
    gruppen: [
      { titel: "Zum Trinken",      woerter: ["MILCH", "SAFT"] },
      { titel: "Im Meer",          woerter: ["FISCH", "WELLE"] },
      { titel: "Im Badezimmer",    woerter: ["SEIFE", "ZAHNBÜRSTE"] },
      { titel: "Fällt vom Himmel", woerter: ["REGEN", "SCHNEE"] }
    ]
  },
  {
    id: 5, nabel: "BLATT", emoji: "🍃", autor: "Ikarus",
    bilder: { BLATT: "🍃", AST: "🌳", WURZEL: "🌱", FROSCH: "🐸", GURKE: "🥒", STIFT: "✏️", PINSEL: "🖌️", "KÜRBIS": "🎃", NEBEL: "🌫️" },
    gruppen: [
      { titel: "Am Baum",   woerter: ["AST", "WURZEL"] },
      { titel: "Ist grün",  woerter: ["FROSCH", "GURKE"] },
      { titel: "Zum Malen", woerter: ["STIFT", "PINSEL"] },
      { titel: "Im Herbst", woerter: ["KÜRBIS", "NEBEL"] }
    ]
  },
  {
    id: 6, nabel: "MAUS", emoji: "🐭", autor: "Ikarus",
    bilder: { MAUS: "🐭", HUND: "🐕", PFERD: "🐴", ELEFANT: "🐘", STEIN: "🪨", AMEISE: "🐜", "MARIENKÄFER": "🐞", TASTATUR: "⌨️", BILDSCHIRM: "🖥️" },
    gruppen: [
      { titel: "Haustier",    woerter: ["HUND", "PFERD"] },
      { titel: "Ist grau",    woerter: ["ELEFANT", "STEIN"] },
      { titel: "Ist winzig",  woerter: ["AMEISE", "MARIENKÄFER"] },
      { titel: "Am Computer", woerter: ["TASTATUR", "BILDSCHIRM"] }
    ]
  },
  {
    id: 7, nabel: "BÄR", emoji: "🐻", autor: "Ikarus",
    bilder: { "BÄR": "🐻", FUCHS: "🦊", REH: "🦌", SCHOKOLADE: "🍫", KEKS: "🍪", ELEFANT: "🐘", "LÖWE": "🦁", BIENE: "🐝", TRAKTOR: "🚜" },
    gruppen: [
      { titel: "Im Wald",      woerter: ["FUCHS", "REH"] },
      { titel: "Schmeckt süß", woerter: ["SCHOKOLADE", "KEKS"] },
      { titel: "Ist stark",    woerter: ["ELEFANT", "LÖWE"] },
      { titel: "Brummt",       woerter: ["BIENE", "TRAKTOR"] }
    ]
  },
  {
    id: 8, nabel: "AUTO", emoji: "🚗", autor: "Ikarus",
    bilder: { AUTO: "🚗", PUPPE: "🪆", TEDDY: "🧸", FAHRRAD: "🚲", ROLLER: "🛴", HAND: "✋", "WÄSCHE": "🧺", BOOT: "🚤", FLUGZEUG: "✈️" },
    gruppen: [
      { titel: "Spielzeug",            woerter: ["PUPPE", "TEDDY"] },
      { titel: "Fährt auf der Straße", woerter: ["FAHRRAD", "ROLLER"] },
      { titel: "Wird gewaschen",       woerter: ["HAND", "WÄSCHE"] },
      { titel: "Hat einen Motor",      woerter: ["BOOT", "FLUGZEUG"] }
    ]
  },
  {
    id: 9, nabel: "BLUME", emoji: "🌸", autor: "Ikarus",
    bilder: { BLUME: "🌸", BAUM: "🌳", GRAS: "🌿", REGENBOGEN: "🌈", LUFTBALLON: "🎈", "PARFÜM": "🧴", SEIFE: "🧼", HERZ: "❤️", KUSS: "💋" },
    gruppen: [
      { titel: "Im Garten",     woerter: ["BAUM", "GRAS"] },
      { titel: "Ist bunt",      woerter: ["REGENBOGEN", "LUFTBALLON"] },
      { titel: "Riecht gut",    woerter: ["PARFÜM", "SEIFE"] },
      { titel: "Zum Muttertag", woerter: ["HERZ", "KUSS"] }
    ]
  },
  {
    id: 10, nabel: "STIFT", emoji: "✏️", autor: "Ikarus",
    bilder: { STIFT: "✏️", PINSEL: "🖌️", FARBE: "🎨", RADIERER: "🧽", LINEAL: "📏", NADEL: "📍", DORN: "🌵", HAMMER: "🔨", ZANGE: "🗜️" },
    gruppen: [
      { titel: "Zum Malen",          woerter: ["PINSEL", "FARBE"] },
      { titel: "In der Federmappe",  woerter: ["RADIERER", "LINEAL"] },
      { titel: "Ist spitz",          woerter: ["NADEL", "DORN"] },
      { titel: "Im Werkzeugkasten",  woerter: ["HAMMER", "ZANGE"] }
    ]
  },
  {
    id: 11, nabel: "SCHUH", emoji: "👟", autor: "Ikarus",
    bilder: { SCHUH: "👟", SOCKE: "🧦", ZEH: "🦶", "MÜLL": "🗑️", "KÄSE": "🧀", RUCKSACK: "🎒", BERG: "⛰️", SCHLANGE: "🐍", FROSCH: "🐸" },
    gruppen: [
      { titel: "Am Fuß",         woerter: ["SOCKE", "ZEH"] },
      { titel: "Kann stinken",   woerter: ["MÜLL", "KÄSE"] },
      { titel: "Beim Wandern",   woerter: ["RUCKSACK", "BERG"] },
      { titel: "Hat eine Zunge", woerter: ["SCHLANGE", "FROSCH"] }
    ]
  },
  {
    id: 12, nabel: "STERN", emoji: "⭐", autor: "Ikarus",
    bilder: { STERN: "⭐", GESCHENK: "🎁", TANNENBAUM: "🎄", MOND: "🌙", PLANET: "🪐", KRONE: "👑", "SÄGE": "🪚", PFERD: "🐴", HUT: "🤠" },
    gruppen: [
      { titel: "An Weihnachten", woerter: ["GESCHENK", "TANNENBAUM"] },
      { titel: "Am Nachthimmel", woerter: ["MOND", "PLANET"] },
      { titel: "Hat Zacken",     woerter: ["KRONE", "SÄGE"] },
      { titel: "Beim Sheriff",   woerter: ["PFERD", "HUT"] }
    ]
  },
  {
    id: 13, nabel: "HUT", emoji: "🎩", autor: "Ikarus",
    bilder: { HUT: "🎩", "MÜTZE": "🧢", KRONE: "👑", KERZE: "🕯️", KUCHEN: "🍰", SCHIRM: "☂️", CREME: "🧴", HASE: "🐰", ZAUBERSTAB: "🪄" },
    gruppen: [
      { titel: "Auf dem Kopf",      woerter: ["MÜTZE", "KRONE"] },
      { titel: "Beim Geburtstag",   woerter: ["KERZE", "KUCHEN"] },
      { titel: "Schützt vor Sonne", woerter: ["SCHIRM", "CREME"] },
      { titel: "Beim Zauberer",     woerter: ["HASE", "ZAUBERSTAB"] }
    ]
  },
  {
    id: 14, nabel: "FEUER", emoji: "🔥", autor: "Ikarus",
    bilder: { FEUER: "🔥", TEE: "🍵", SUPPE: "🍲", TOMATE: "🍅", ERDBEERE: "🍓", ZELT: "⛺", HOLZ: "🪵", LEITER: "🪜", HELM: "⛑️" },
    gruppen: [
      { titel: "Ist heiß",          woerter: ["TEE", "SUPPE"] },
      { titel: "Ist rot",           woerter: ["TOMATE", "ERDBEERE"] },
      { titel: "Beim Lagerfeuer",   woerter: ["ZELT", "HOLZ"] },
      { titel: "Bei der Feuerwehr", woerter: ["LEITER", "HELM"] }
    ]
  }
];
