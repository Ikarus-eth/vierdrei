/* VIER x DREI - Kinderrätsel
 *
 * Einfacher als die Erwachsenenfassung: nur DREI Kategorien statt vier, also
 * sieben Karten statt neun. Jedes Wort hat ein Bild — deshalb funktioniert das
 * Spiel auch, wenn das Lesen noch hakt.
 *
 * Struktur wie in puzzles.js, plus "bilder": Wort -> Emoji für jede der sieben
 * Karten. Fehlt ein Bild, zeigt die Karte nur das Wort.
 *
 * Wörter aus dem Grundschulwortschatz. Kategorien beschreiben etwas, das man
 * sehen oder anfassen kann — keine Wortspiele.
 */
window.VMD_KINDER = [
  {
    id: 1, nabel: "BALL", emoji: "⚽", autor: "Ikarus",
    bilder: { BALL: "⚽", PUPPE: "🪆", TEDDY: "🧸", RAD: "🛞", MOND: "🌕", TOR: "🥅", SCHUH: "👟" },
    gruppen: [
      { titel: "Spielzeug",      woerter: ["PUPPE", "TEDDY"] },
      { titel: "Ist rund",       woerter: ["RAD", "MOND"] },
      { titel: "Beim Fußball",   woerter: ["TOR", "SCHUH"] }
    ]
  },
  {
    id: 2, nabel: "KATZE", emoji: "🐈", autor: "Ikarus",
    bilder: { KATZE: "🐈", HUND: "🐕", FISCH: "🐠", AFFE: "🐒", EICHHÖRNCHEN: "🐿️", KISSEN: "🛏️", WOLLE: "🧶" },
    gruppen: [
      { titel: "Haustier",       woerter: ["HUND", "FISCH"] },
      { titel: "Ist weich",      woerter: ["KISSEN", "WOLLE"] },
      { titel: "Klettert gern",  woerter: ["AFFE", "EICHHÖRNCHEN"] }
    ]
  },
  {
    id: 3, nabel: "SONNE", emoji: "☀️", autor: "Ikarus",
    bilder: { SONNE: "☀️", WOLKE: "☁️", REGENBOGEN: "🌈", BANANE: "🍌", ZITRONE: "🍋", FEUER: "🔥", SUPPE: "🍲" },
    gruppen: [
      { titel: "Am Himmel",  woerter: ["WOLKE", "REGENBOGEN"] },
      { titel: "Ist gelb",   woerter: ["BANANE", "ZITRONE"] },
      { titel: "Ist heiß",   woerter: ["FEUER", "SUPPE"] }
    ]
  },
  {
    id: 4, nabel: "WASSER", emoji: "💧", autor: "Ikarus",
    bilder: { WASSER: "💧", MILCH: "🥛", SAFT: "🧃", FISCH: "🐟", WELLE: "🌊", REGEN: "🌧️", SCHNEE: "❄️" },
    gruppen: [
      { titel: "Zum Trinken",       woerter: ["MILCH", "SAFT"] },
      { titel: "Im Meer",           woerter: ["FISCH", "WELLE"] },
      { titel: "Fällt vom Himmel",  woerter: ["REGEN", "SCHNEE"] }
    ]
  },
  {
    id: 5, nabel: "BLATT", emoji: "🍃", autor: "Ikarus",
    bilder: { BLATT: "🍃", AST: "🌳", WURZEL: "🌱", STIFT: "✏️", PINSEL: "🖌️", FROSCH: "🐸", GURKE: "🥒" },
    gruppen: [
      { titel: "Am Baum",     woerter: ["AST", "WURZEL"] },
      { titel: "Ist grün",    woerter: ["FROSCH", "GURKE"] },
      { titel: "Zum Malen",   woerter: ["STIFT", "PINSEL"] }
    ]
  },
  {
    id: 6, nabel: "MAUS", emoji: "🐭", autor: "Ikarus",
    bilder: { MAUS: "🐭", KATZE: "🐈", HAMSTER: "🐹", TASTATUR: "⌨️", BILDSCHIRM: "🖥️", ELEFANT: "🐘", STEIN: "🪨" },
    gruppen: [
      { titel: "Haustier",      woerter: ["KATZE", "HAMSTER"] },
      { titel: "Ist grau",      woerter: ["ELEFANT", "STEIN"] },
      { titel: "Am Computer",   woerter: ["TASTATUR", "BILDSCHIRM"] }
    ]
  },
  {
    id: 7, nabel: "BÄR", emoji: "🐻", autor: "Ikarus",
    bilder: { "BÄR": "🐻", FUCHS: "🦊", REH: "🦌", ELEFANT: "🐘", "LÖWE": "🦁", SCHOKOLADE: "🍫", KEKS: "🍪" },
    gruppen: [
      { titel: "Im Wald",        woerter: ["FUCHS", "REH"] },
      { titel: "Schmeckt süß",   woerter: ["SCHOKOLADE", "KEKS"] },
      { titel: "Ist stark",      woerter: ["ELEFANT", "LÖWE"] }
    ]
  },
  {
    id: 8, nabel: "AUTO", emoji: "🚗", autor: "Ikarus",
    bilder: { AUTO: "🚗", FAHRRAD: "🚲", ROLLER: "🛴", BOOT: "🚤", FLUGZEUG: "✈️", PUPPE: "🪆", TEDDY: "🧸" },
    gruppen: [
      { titel: "Spielzeug",            woerter: ["PUPPE", "TEDDY"] },
      { titel: "Fährt auf der Straße", woerter: ["FAHRRAD", "ROLLER"] },
      { titel: "Hat einen Motor",      woerter: ["BOOT", "FLUGZEUG"] }
    ]
  },
  {
    id: 9, nabel: "BLUME", emoji: "🌸", autor: "Ikarus",
    bilder: { BLUME: "🌸", BAUM: "🌳", GRAS: "🌿", "PARFÜM": "🧴", SEIFE: "🧼", REGENBOGEN: "🌈", LUFTBALLON: "🎈" },
    gruppen: [
      { titel: "Im Garten",   woerter: ["BAUM", "GRAS"] },
      { titel: "Ist bunt",    woerter: ["REGENBOGEN", "LUFTBALLON"] },
      { titel: "Riecht gut",  woerter: ["PARFÜM", "SEIFE"] }
    ]
  },
  {
    id: 10, nabel: "STIFT", emoji: "✏️", autor: "Ikarus",
    bilder: { STIFT: "✏️", NADEL: "📍", MESSER: "🔪", RADIERER: "🧽", LINEAL: "📏", PINSEL: "🖌️", FARBE: "🎨" },
    gruppen: [
      { titel: "Zum Malen",         woerter: ["PINSEL", "FARBE"] },
      { titel: "In der Federmappe", woerter: ["RADIERER", "LINEAL"] },
      { titel: "Ist spitz",         woerter: ["NADEL", "MESSER"] }
    ]
  },
  {
    id: 11, nabel: "SCHUH", emoji: "👟", autor: "Ikarus",
    bilder: { SCHUH: "👟", SOCKE: "🧦", ZEH: "🦶", "MÜLL": "🗑️", "KÄSE": "🧀", RUCKSACK: "🎒", BERG: "⛰️" },
    gruppen: [
      { titel: "Am Fuß",        woerter: ["SOCKE", "ZEH"] },
      { titel: "Beim Wandern",  woerter: ["RUCKSACK", "BERG"] },
      { titel: "Kann stinken",  woerter: ["MÜLL", "KÄSE"] }
    ]
  },
  {
    id: 12, nabel: "STERN", emoji: "⭐", autor: "Ikarus",
    bilder: { STERN: "⭐", MOND: "🌙", PLANET: "🪐", GESCHENK: "🎁", TANNENBAUM: "🎄", KRONE: "👑", "SÄGE": "🪚" },
    gruppen: [
      { titel: "An Weihnachten",  woerter: ["GESCHENK", "TANNENBAUM"] },
      { titel: "Am Nachthimmel",  woerter: ["MOND", "PLANET"] },
      { titel: "Hat Zacken",      woerter: ["KRONE", "SÄGE"] }
    ]
  },
  {
    id: 13, nabel: "HUT", emoji: "🎩", autor: "Ikarus",
    bilder: { HUT: "🎩", "MÜTZE": "🧢", KRONE: "👑", HASE: "🐰", ZAUBERSTAB: "🪄", SCHIRM: "☂️", CREME: "🧴" },
    gruppen: [
      { titel: "Auf dem Kopf",       woerter: ["MÜTZE", "KRONE"] },
      { titel: "Schützt vor Sonne",  woerter: ["SCHIRM", "CREME"] },
      { titel: "Beim Zauberer",      woerter: ["HASE", "ZAUBERSTAB"] }
    ]
  },
  {
    id: 14, nabel: "FEUER", emoji: "🔥", autor: "Ikarus",
    bilder: { FEUER: "🔥", TEE: "🍵", SUPPE: "🍲", LEITER: "🪜", HELM: "⛑️", ZELT: "⛺", HOLZ: "🪵" },
    gruppen: [
      { titel: "Ist heiß",           woerter: ["TEE", "SUPPE"] },
      { titel: "Beim Lagerfeuer",    woerter: ["ZELT", "HOLZ"] },
      { titel: "Bei der Feuerwehr",  woerter: ["LEITER", "HELM"] }
    ]
  }
];
