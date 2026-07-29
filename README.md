# samyu.studio — the studio site

One static GitHub Pages site doing two jobs at once:

1. **The shop window.** A real game studio site: what Samyu Studio is, what it stands
   for, and a page per game with screenshots, cast, facts and a press kit.
2. **The store plumbing.** The privacy and support URLs Apple and Google require for
   EVERY app, plus `app-ads.txt` for AdMob. Those URLs have not moved and must not.

No build step, no dependencies, no framework. Edit the HTML, push, done.

## Layout
```
index.html                     studio home (hero + hold demo + games + rules + who)
404.html                       styled not-found
favicon.ico                    root fallback (browsers request this by default)
app-ads.txt                    AdMob seller authorization — domain root
CNAME                          samyu.studio

assets/
  css/site.css                 shared design system + the legal/support page styles
  css/studio.css               studio home only
  css/game.css                 game pages only
  js/strain.js                 the hold demo
  fonts/                       3 self-hosted files, 66 KB total
  img/                         everything, generated from the game's own source art

<game-id>/
  index.html                   the game's own page
  privacy.html                 ⚠ store-linked URL, do not move or rename
  support.html                 ⚠ store-linked URL, do not move or rename
  press/                       hi-res art offered on the game page
```

## The one thing to understand before editing

**Every image here is generated from the game's real source art**, never redrawn for the
web, so the site cannot drift from what ships in the store. The inputs, all under
`C:\Samuel\games\poli-fartride`:

| Site asset | Source |
|---|---|
| `strain-0..5.webp` | `assets-raw/concepts/main/main face sheet.png` — grey keyed out by corner flood fill, split on alpha valleys (the heads overlap, so a fixed six-up grid slices a sliver of the neighbour into every cell), then all six composited onto ONE shared canvas so they swap without jumping scale or baseline |
| `poli-flying.webp` | `assets-raw/concepts/main/main flying.png` |
| `cast-*.webp` | `game/assets/<id>/body_full.png` — the actual shop sprites |
| `shot-*.webp`, `press/*` | `store/screenshots-6.5/*.png` — the exact five Apple sees |
| `icon-poli-*` | `assets-raw/store/icon_1024.png` |
| Luckiest Guy woff2 | `game/assets/fonts/LuckiestGuy-Regular.ttf` |
| `favicon.svg` | the same font's `S` glyph, converted to an SVG path so the mark needs no font file |

If the store screenshots change, regenerate rather than hand-editing.

## Adding a new game
1. `mkdir <game-id>`, copy `polifartride/index.html` + `privacy.html` + `support.html`.
2. Find/replace the game name, rewrite the copy, swap the art.
3. Add it to the `#games` section of the root `index.html` and to both footers.
4. Commit and push. Live in about a minute.

## Store fields these satisfy
- Apple: Privacy Policy URL (mandatory, even at zero data collection) and Support URL
  (mandatory). Marketing URL: the game page, `https://samyu.studio/<game-id>/`.
- Google Play: Privacy Policy URL (mandatory) and developer website.
- AdMob: `app-ads.txt` at the domain root, matching the store listing's website.

## Deploy
Push to `main` on `Mastsam10/samyu-studio`; GitHub Pages publishes to samyu.studio.

DNS at the registrar must stay:
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  <username>.github.io
```
Repo Settings → Pages → Custom domain = samyu.studio, "Enforce HTTPS" ticked.

Local preview (absolute `/assets/...` paths need a server root, so `file://` will not work):
```
python -m http.server 8123 --directory C:/Samuel/games/studio-site
```

## Rules
- Whenever data collection changes (ads, analytics, accounts, a backend), update the
  affected `privacy.html` IN THE SAME RELEASE as the store declaration changes.
- Nothing public may claim a release date or a store link that does not exist yet. The
  status line reads "in testing" until a build is actually live.
- `app-ads.txt` still carries the placeholder publisher ID. Replace
  `pub-0000000000000000` with the real AdMob ID before ads go live; AdMob reads an
  unmatched file as an authorization failure, which is worse than having no file.
