/* VIER x DREI - Rätseldaten
 *
 * Jedes Rätsel: 9 Wörter. Ein Nabelwort steht in allen vier Kategorien,
 * jedes andere Wort in genau einer. Kategorien sind von leicht (1) nach
 * schwer (4) sortiert - Reihenfolge = Schwierigkeit = Farbe.
 *
 * Struktur:
 *   { id, nabel, emoji, autor, gruppen: [ { titel, woerter: [a, b] }, ... x4 ] }
 * "woerter" listet nur die beiden Wörter NEBEN dem Nabelwort.
 *
 * Neue Rätsel bauen: build.html im selben Ordner öffnen.
 */
window.VMD_PUZZLES = [
  {
    id: 1, nabel: "BANK", emoji: "🏦", autor: "Ikarus",
    gruppen: [
      { titel: "Zum Sitzen",        woerter: ["STUHL", "SESSEL"] },
      { titel: "Wo das Geld liegt", woerter: ["SPARKASSE", "TRESOR"] },
      { titel: "In der Werkstatt",  woerter: ["HOBEL", "SCHRAUBSTOCK"] },
      { titel: "Untiefe im Meer",   woerter: ["RIFF", "DÜNE"] }
    ]
  },
  {
    id: 2, nabel: "SCHLOSS", emoji: "🏰", autor: "Ikarus",
    gruppen: [
      { titel: "Prunkbau",          woerter: ["BURG", "PALAST"] },
      { titel: "An der Tür",        woerter: ["KLINKE", "ANGEL"] },
      { titel: "Am Fahrrad",        woerter: ["KLINGEL", "SATTEL"] },
      { titel: "Hat einen Zylinder", woerter: ["MOTOR", "HUT"] }
    ]
  },
  {
    id: 3, nabel: "ZUG", emoji: "🚂", autor: "Ikarus",
    gruppen: [
      { titel: "Öffentlicher Verkehr", woerter: ["TRAM", "FÄHRE"] },
      { titel: "Beim Schach",          woerter: ["BAUER", "TURM"] },
      { titel: "Bewegte Luft",         woerter: ["BRISE", "WIND"] },
      { titel: "Schweizer Kanton",     woerter: ["BERN", "WALLIS"] }
    ]
  },
  {
    id: 4, nabel: "BALL", emoji: "⚽", autor: "Ikarus",
    gruppen: [
      { titel: "Rund",                    woerter: ["KUGEL", "GLOBUS"] },
      { titel: "Beim Fußball",            woerter: ["TOR", "ECKE"] },
      { titel: "Festliche Tanzveranstaltung", woerter: ["GALA", "SOIRÉE"] },
      { titel: "… werfen",                woerter: ["ANKER", "SCHATTEN"] }
    ]
  },
  {
    id: 5, nabel: "BLATT", emoji: "🍃", autor: "Ikarus",
    gruppen: [
      { titel: "Am Baum",           woerter: ["AST", "RINDE"] },
      { titel: "Papier",            woerter: ["BOGEN", "SEITE"] },
      { titel: "Beim Kartenspiel",  woerter: ["ASS", "TRUMPF"] },
      { titel: "Teil einer Säge",   woerter: ["ZAHN", "GRIFF"] }
    ]
  },
  {
    id: 6, nabel: "KRONE", emoji: "👑", autor: "Ikarus",
    gruppen: [
      { titel: "Zeichen der Macht", woerter: ["ZEPTER", "THRON"] },
      { titel: "Am Baum",           woerter: ["STAMM", "WURZEL"] },
      { titel: "Beim Zahnarzt",     woerter: ["PLOMBE", "SCHMELZ"] },
      { titel: "Währung",           woerter: ["RUBEL", "FORINT"] }
    ]
  },
  {
    id: 7, nabel: "FEDER", emoji: "🪶", autor: "Ikarus",
    gruppen: [
      { titel: "Am Vogel",           woerter: ["FLÜGEL", "SCHNABEL"] },
      { titel: "Alte Schreibsachen", woerter: ["TINTE", "PERGAMENT"] },
      { titel: "Im Fahrwerk",        woerter: ["STOSSDÄMPFER", "ACHSE"] },
      { titel: "Im Uhrwerk",         woerter: ["ZEIGER", "ZAHNRAD"] }
    ]
  },
  {
    id: 8, nabel: "BIRNE", emoji: "🍐", autor: "Ikarus",
    gruppen: [
      { titel: "Obst",            woerter: ["PFLAUME", "KIRSCHE"] },
      { titel: "An der Lampe",    woerter: ["FASSUNG", "SCHIRM"] },
      { titel: "Salopp für Kopf", woerter: ["RÜBE", "KÜRBIS"] },
      { titel: "Zum Schrauben",   woerter: ["MUTTER", "KAPPE"] }
    ]
  },
  {
    id: 9, nabel: "ABSATZ", emoji: "👠", autor: "Ikarus",
    gruppen: [
      { titel: "Am Schuh",      woerter: ["SOHLE", "SENKEL"] },
      { titel: "Im Text",       woerter: ["ZEILE", "KAPITEL"] },
      { titel: "An der Treppe", woerter: ["STUFE", "GELÄNDER"] },
      { titel: "In der Bilanz", woerter: ["UMSATZ", "GEWINN"] }
    ]
  },
  {
    id: 10, nabel: "NOTE", emoji: "🎵", autor: "Ikarus",
    gruppen: [
      { titel: "In der Musik", woerter: ["TAKT", "PAUSE"] },
      { titel: "Im Zeugnis",   woerter: ["ZENSUR", "BETRAGEN"] },
      { titel: "Beim Wein",    woerter: ["AROMA", "BOUQUET"] },
      { titel: "Geld",         woerter: ["MÜNZE", "SCHEIN"] }
    ]
  },
  {
    id: 11, nabel: "HAHN", emoji: "🐓", autor: "Ikarus",
    gruppen: [
      { titel: "Auf dem Hühnerhof", woerter: ["HENNE", "KÜKEN"] },
      { titel: "Beim Klempner",     woerter: ["ROHR", "VENTIL"] },
      { titel: "Am Gewehr",         woerter: ["LAUF", "KOLBEN"] },
      { titel: "Wappentier",        woerter: ["ADLER", "BÄR"] }
    ]
  },
  {
    id: 12, nabel: "LEITER", emoji: "🪜", autor: "Ikarus",
    gruppen: [
      { titel: "Vorgesetzter",           woerter: ["CHEF", "BOSS"] },
      { titel: "Auf der Baustelle",      woerter: ["GERÜST", "BOCK"] },
      { titel: "Leitet Strom",           woerter: ["KUPFER", "GRAPHIT"] },
      { titel: "Auf dem Feuerwehrauto",  woerter: ["SCHLAUCH", "PUMPE"] }
    ]
  },
  {
    id: 13, nabel: "GOLF", emoji: "⛳", autor: "Ikarus",
    gruppen: [
      { titel: "Ballsport",      woerter: ["TENNIS", "RUGBY"] },
      { titel: "VW-Modell",      woerter: ["PASSAT", "KÄFER"] },
      { titel: "Meeresbucht",    woerter: ["BUCHT", "FJORD"] },
      { titel: "NATO-Alphabet",  woerter: ["HOTEL", "TANGO"] }
    ]
  },
  {
    id: 14, nabel: "ELF", emoji: "🧝", autor: "Ikarus",
    gruppen: [
      { titel: "Fabelwesen",    woerter: ["ZWERG", "KOBOLD"] },
      { titel: "Die Mannschaft", woerter: ["TEAM", "AUSWAHL"] },
      { titel: "Ungerade Zahl", woerter: ["SIEBEN", "DREIZEHN"] },
      { titel: "Karneval",      woerter: ["NARR", "KONFETTI"] }
    ]
  },
  {
    id: 15, nabel: "TON", emoji: "🎶", autor: "Ikarus",
    gruppen: [
      { titel: "Musik",              woerter: ["KLANG", "MELODIE"] },
      { titel: "Formbares Material", woerter: ["LEHM", "GIPS"] },
      { titel: "Farbabstufung",      woerter: ["NUANCE", "SCHATTIERUNG"] },
      { titel: "Umgangsform",        woerter: ["MANIER", "STIL"] }
    ]
  },
  {
    id: 16, nabel: "STROM", emoji: "⚡", autor: "Ikarus",
    gruppen: [
      { titel: "Elektrisch",      woerter: ["SPANNUNG", "VOLT"] },
      { titel: "Großer Fluss",    woerter: ["RHEIN", "DONAU"] },
      { titel: "Viel auf einmal", woerter: ["FLUT", "SCHWALL"] },
      { titel: "…ausfall",        woerter: ["HAAR", "TOTAL"] }
    ]
  },
  {
    id: 17, nabel: "BAR", emoji: "🍸", autor: "Ikarus",
    gruppen: [
      { titel: "Zum Trinken",            woerter: ["KNEIPE", "PUB"] },
      { titel: "Im Hotel",               woerter: ["LOBBY", "REZEPTION"] },
      { titel: "Zahlungsart",            woerter: ["KARTE", "ÜBERWEISUNG"] },
      { titel: "Physikalische Einheit",  woerter: ["PASCAL", "NEWTON"] }
    ]
  },
  {
    id: 18, nabel: "ERDE", emoji: "🌍", autor: "Ikarus",
    gruppen: [
      { titel: "Planet",              woerter: ["MARS", "VENUS"] },
      { titel: "Im Beet",             woerter: ["HUMUS", "SAND"] },
      { titel: "Klassisches Element", woerter: ["FEUER", "WASSER"] },
      { titel: "In der Steckdose",    woerter: ["PHASE", "NULLLEITER"] }
    ]
  },
  {
    id: 19, nabel: "SCHLANGE", emoji: "🐍", autor: "Ikarus",
    gruppen: [
      { titel: "Kriecht und hüpft", woerter: ["ECHSE", "KRÖTE"] },
      { titel: "Anstehen",          woerter: ["REIHE", "KOLONNE"] },
      { titel: "Sternbild",         woerter: ["WAAGE", "STIER"] },
      { titel: "Windet sich",       woerter: ["SERPENTINE", "MÄANDER"] }
    ]
  },
  {
    id: 20, nabel: "KOHL", emoji: "🥬", autor: "Ikarus",
    gruppen: [
      { titel: "Bundeskanzler",  woerter: ["SCHRÖDER", "MERKEL"] },
      { titel: "Unsinn",         woerter: ["QUARK", "KÄSE"] },
      { titel: "Wird eingelegt", woerter: ["GURKE", "HERING"] },
      { titel: "Weiß…",          woerter: ["WEIN", "BIER"] }
    ]
  },
  {
    id: 21, nabel: "SCHNEE", emoji: "❄️", autor: "Ikarus",
    gruppen: [
      { titel: "Niederschlag",           woerter: ["REGEN", "HAGEL"] },
      { titel: "Im Hochgebirge",         woerter: ["GIPFEL", "FIRN"] },
      { titel: "Aus Eiweiß",             woerter: ["BAISER", "SCHAUM"] },
      { titel: "Schlechtes Fernsehbild", woerter: ["RAUSCHEN", "FLIMMERN"] }
    ]
  }
];
