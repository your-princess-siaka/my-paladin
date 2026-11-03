// Offline support: pages and photos are saved on the phone. Music and voice notes stream normally.
const C = "paladin-v1";
const FILES = ["./", "index.html", "dreams.html", "closer.html", "manifest.webmanifest",
  "images/icon.png", "images/me.jpg", "images/him.jpeg",
  "images/moment1.jpeg", "images/moment2.jpeg", "images/moment3.jpeg", "images/moment4.jpeg"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || /\.(mp3|m4a)$/.test(r.url) || r.headers.has("range")) return;
  e.respondWith(fetch(r).then(res => { const k = res.clone(); caches.open(C).then(c => c.put(r, k)); return res; })
    .catch(() => caches.match(r)));
});
