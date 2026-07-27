/* Netz zuerst, Cache nur als Rückfall.
 * cache:"no-store" erzwingt einen echten Netzabruf statt einer stillen
 * HTTP-Cache-Kopie — ohne das liefert iOS nach einem Deploy tagelang die
 * alte App aus. Registrierung nutzt zusätzlich updateViaCache:"none". */
const CACHE = "vierdrei-v2";
const ASSETS = ["./", "./index.html", "./puzzles.js", "./puzzles-kinder.js", "./build.html", "./manifest.json", "./icon-180.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-store" })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
