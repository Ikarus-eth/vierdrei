/* Testläufer: keine Abhängigkeit außer jsdom. */
const files = ["daten.test.js", "spiel.test.js", "baukasten.test.js"];
(async () => {
  let ok = 0, fail = 0;
  for (const f of files) {
    console.log("\n\x1b[1m" + f + "\x1b[0m");
    for (const [name, fn] of require("./" + f)) {
      try { await fn(); console.log("  \x1b[32m✓\x1b[0m " + name); ok++; }
      catch (e) { console.log("  \x1b[31m✗\x1b[0m " + name + "\n      " + (e.message || e).split("\n")[0]); fail++; }
    }
  }
  console.log("\n" + ok + " bestanden, " + fail + " fehlgeschlagen");
  process.exit(fail ? 1 : 0);
})();
