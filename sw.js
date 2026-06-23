// Kill-switch service worker for the retired PhotoBlast PWA.
//
// Old installs registered a Workbox service worker at /photoblast/sw.js and
// precached the whole app, so they keep serving a frozen copy of PhotoBlast and
// never update (their update URL used to redirect, which the SW spec rejects).
//
// Serving THIS file at that same URL finally lets the browser's automatic
// update check succeed: it installs this worker, which wipes the stale precache,
// unregisters itself, and reloads open windows so they fetch the network
// "we've moved to BoothBop" page. A PWA can't migrate across origins, so this is
// the graceful hand-off — not an in-place upgrade.

self.addEventListener("install", () => {
  // Take over as soon as possible instead of waiting for all tabs to close.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 1. Delete every cache the old PhotoBlast precache created.
      for (const key of await caches.keys()) {
        await caches.delete(key);
      }
      // 2. Control current pages, then stop controlling this scope for good.
      await self.clients.claim();
      await self.registration.unregister();
      // 3. Reload open windows — now uncontrolled + cacheless, so they hit the
      //    network and land on the migration page.
      for (const client of await self.clients.matchAll({ type: "window" })) {
        client.navigate(client.url);
      }
    })(),
  );
});
