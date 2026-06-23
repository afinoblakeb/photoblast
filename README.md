# photoblast (retired)

This repo serves only a **migration page + kill-switch service worker** at
`afinoblakeb.github.io/photoblast/`. The app was renamed to **BoothBop** and
moved to <https://boothbop.com> (repo: `afinoblakeb/boothbop`).

Old PhotoBlast PWA installs registered a service worker at `/photoblast/sw.js`.
This repo re-serves that path with a self-unregistering worker (`sw.js`) that
clears the stale precache and sends users to boothbop.com. Do not add a custom
domain here — it must keep serving on the `github.io/photoblast/` origin so old
installs can find it.
