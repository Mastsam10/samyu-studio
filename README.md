# samyu.studio — legal pages for every game

One GitHub Pages site serving the privacy + support URLs that Apple and Google
require for EVERY app. Set up once; each new game costs one folder.

## Layout
```
index.html            studio landing page (links every game)
app-ads.txt           AdMob seller authorization (domain root — required once ads are live)
<game-id>/privacy.html
<game-id>/support.html
```

## Adding a new game (2 minutes)
1. `mkdir <game-id>` and copy `polifartride/privacy.html` + `support.html` into it.
2. Find/replace the game name inside both files.
3. Add a row to `index.html`.
4. Commit and push. URLs are live in ~1 minute:
   `https://samyu.studio/<game-id>/privacy.html`

## Store fields these satisfy
- Apple: Privacy Policy URL (mandatory, even at zero data collection) and
  Support URL (mandatory). Marketing URL is optional — leave blank.
- Google Play: Privacy Policy URL (mandatory) and developer website.
- AdMob: app-ads.txt at the domain root, matching the store listing's website.

## Custom domain (LIVE: samyu.studio)
`CNAME` holds the bare domain. DNS at the registrar must be:
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  <username>.github.io
```
Then GitHub repo Settings > Pages > Custom domain = samyu.studio, and tick
"Enforce HTTPS" once the certificate provisions (can take up to ~24h).

## Rule
Whenever data collection changes (ads, analytics, accounts, a backend), update
the affected privacy.html IN THE SAME RELEASE as the store declaration changes.
