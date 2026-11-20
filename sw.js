// সার্ভিস ওয়ার্কার: প্রথমবার খোলার পর অ্যাপ ইন্টারনেট ছাড়াই চলে (cache-first)।
// অ্যাপের কণ্ঠের ফাইল (voice/…mp3) অনেক — তাই প্রথমবার শুধু মেয়ে কণ্ঠের প্রথম ভাগ (VOICE) নেয়; বাকিগুলো বাজানোর সময়
// বা অভিভাবক প্যানেলের "অফলাইনের জন্য সব কণ্ঠ নামাই" চাপলে জমা হয়। কোনোটা না নামলেও অ্যাপ বসে যায়।
const CACHE = 'asp-v0.12.2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const VOICE = ['./voice/v001.mp3','./voice/v002.mp3','./voice/v003.mp3','./voice/v004.mp3','./voice/v005.mp3','./voice/v006.mp3','./voice/v007.mp3','./voice/v008.mp3','./voice/v009.mp3','./voice/v010.mp3','./voice/v011.mp3','./voice/v012.mp3','./voice/v013.mp3','./voice/v014.mp3','./voice/v015.mp3','./voice/v016.mp3','./voice/v017.mp3','./voice/v018.mp3','./voice/v019.mp3','./voice/v020.mp3','./voice/v021.mp3','./voice/v022.mp3','./voice/v023.mp3','./voice/v024.mp3','./voice/v025.mp3','./voice/v026.mp3','./voice/v027.mp3','./voice/v028.mp3','./voice/v029.mp3','./voice/v030.mp3','./voice/v031.mp3','./voice/v032.mp3','./voice/v033.mp3','./voice/v034.mp3','./voice/v035.mp3','./voice/v036.mp3','./voice/v037.mp3','./voice/v038.mp3','./voice/v039.mp3'];
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(FILES).then(() => Promise.all(VOICE.map((u) => c.add(u).catch(() => null)))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(e.request).then((r) => {
          if (r && r.ok && /\/voice\/.+\.mp3$/.test(new URL(e.request.url).pathname)) {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return r;
        })
    )
  );
});
