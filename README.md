# ICRAIS 2026: animated presentation

*A Multi-Tier Genetic Algorithm for Large-Scale Liner Shipping Network Design*: Nirmal Rampersand & Oomesh Gukhool.

React + TypeScript + Motion. 31 scenes, 105 reveal steps, about 13:45 of speaking. The built site is one self-contained file and runs fully offline.

## Commands
```bash
npm install
npm run dev          # develop at http://localhost:5173
npm run build        # -> dist/index.html (self-contained: JS, CSS, fonts and data inlined) and dist/remote.html
npm start            # serve dist and the phone/watch remote at http://localhost:3015 (build first)
npm run export:pdf   # -> exports/*.pdf (light, dark, speaker notes)
npm test             # unit tests: navigation, claims ledger vs paper/solver source, scene registry, contrast
npx playwright test  # e2e: full-show walk, touch, scroll, remote, print route (needs `npm run build` first)
```

## Controls
| Input | Action |
|---|---|
| → Space PgDn ↓ / ← PgUp ↑ | next / previous reveal |
| Shift + → / ←, or `]` / `[` | next / previous scene |
| Bottom slider (move the mouse to show it) | scrub through scenes |
| `O` overview, `F` fullscreen, `T` theme, `B` black screen, `M` motion, `?` help | |
| Touch (iPad): swipe, or tap right side / left third | next / previous reveal |
| Touch: tap the strip along the bottom edge | show the slider, theme and fullscreen buttons |
| Scroll wheel or trackpad scroll | one gesture is one step |

## Deploy on icrais.unrism.com (nginx, pm2, certbot)
One small Node process, `server/server.mjs`, does everything: it serves the slides **and** the phone/watch remote.
nginx only forwards the domain to it. There are no tokens and no separate static hosting.

**1. Put it on the server.** Build on your Mac, then copy three things:
```bash
npm ci && npm run build
rsync -av dist server ecosystem.config.cjs you@server:/opt/icrais/
```
On the server (Node 18 or newer):
```bash
cd /opt/icrais && pm2 start ecosystem.config.cjs && pm2 save
curl http://127.0.0.1:3015/health        # {"ok":true,"listeners":0}
```

**2. nginx.**
```nginx
server {
    server_name icrais.unrism.com;
    location / {
        proxy_pass http://127.0.0.1:3015;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Connection '';
        proxy_buffering off;          # needed for the live remote connection
        proxy_read_timeout 1h;
    }
}
```
Reload nginx, then `sudo certbot --nginx -d icrais.unrism.com`.

**3. Addresses.**

| Who | Address |
|---|---|
| Audience or anyone | `https://icrais.unrism.com` |
| You, on the presenting laptop | `https://icrais.unrism.com/?remote` (only this page obeys the remote) |
| Phone remote | `https://icrais.unrism.com/remote` (Share, then Add to Home Screen) |
| Apple Watch Shortcut | **Get Contents of URL** `https://icrais.unrism.com/cmd/next`, and `/cmd/prev` |

Other commands: `nextScene`, `prevScene`, `home`, `end`, `black`, `theme`. Audience copies never move because only a page opened with `?remote` listens.

**4. Test the watch, in this order.**
1. Open `/?remote` on the laptop, then `curl https://icrais.unrism.com/health`. `listeners` should be 1.
2. `curl https://icrais.unrism.com/cmd/next`. The slide should advance. If this works, the server side is done.
3. On the iPhone open `/remote` and tap Next and Back.
4. Create the two Shortcuts on the iPhone, run them there, then run them from the watch.
5. Try Double Tap (Series 9, Series 10, Ultra 2) and AssistiveTouch, and check the delay on the venue network.

**Double Tap on the watch (watch mode).** Double Tap cannot run a Shortcut, but it controls media. On the iPhone open
`/remote`, tap **Start watch mode** and keep the page open (the screen may lock). The phone then plays a silent track and shows as
"Now Playing" on the watch: **Double Tap = next**, the watch's **skip forward = next** and **skip back = Back**.

If the watch misbehaves, the keyboard, touch and phone remote keep working. I tested the commands end to end in a browser, not on a physical watch or iPad.

**5. iPad.** For a full-screen look, Share, then **Add to Home Screen**, and open it from the icon.

**Good to know.**
- There is deliberately no password. While a `?remote` page is open, anyone who knows the address can advance your slides and nothing else. If that worries you, put basic auth on `location /cmd/` in nginx.
- For the talk itself, keep `dist/index.html` on a USB stick. It works alone from `file://` with no server and no network.
- Redeploying: rebuild, `rsync` again, `pm2 restart icrais`.

## How it is organised
- `src/content/references.ts`: the bibliography. 14 entries are copied from the paper's own reference list; 4 were added after looking them up (DOI or ISBN recorded). Slides cite with `cite('plum2014')`; tests check each entry against `sources/paper.txt`, that every citation exists and that every reference is cited.
- `src/content/claims.ts`: **every number shown on screen**, with a status (published, figure-run, instance, illustrative, derived, exploratory) and, where possible, a quote that a test verifies against `sources/paper.txt` or `sources/solver_ga_v20_b.py`.
- `src/content/scenes.ts`: scene registry (ids, steps, timing, claim ids). `src/scenes/S*.tsx`: one file per scene, rendering a pure function of `step`. `src/content/notes.ts`: speaker notes and Q&A prep.
- `src/engine/`: 1920×1080 stage, navigation reducer, keyboard, touch and scroll input, overview and help chrome, print view, preflight, remote listener.
- `server/server.mjs`: the single Node server (static files, `/events`, `/cmd/<name>`, `/health`, `/remote`). `public/remote.html`: the phone remote page.
- `src/data/figrun-*.json`: per-generation series digitised from the paper's Fig. 2 PNGs by `scripts/digitise_figures.py`, validated against the stated endpoints (overlays in `scripts/out/`).
- `src/data/ports.json`, `fleet.json`: WorldSmall **inputs only**, built by `scripts/build_instance_data.py` from `../results/results_ga_v20_b/`.
- `src/data/solution.json`: one real WorldLarge solution (201 ports, 97 services: 21 direct, 24 trunk, 52 feeder, plus one real 10-port, 23-vessel trunk loop), built by `scripts/build_solution_data.py` from `../results_pso_wl_v10_final/`. Service type comes from the candidate pool each service was drawn from (checked against vessel classes). The slide calls it a WorldLarge solution and shows structure only; where it comes from (another algorithm) and its totals and caveats are in the speaker notes and Q&A.
- `src/data/instances.json`: baseline against Multi-Tier on Baltic, WAF, Mediterranean and Pacific (one run each), built by `scripts/build_instances_data.py` from `../results/results_ga_baseline/`. These are exploratory and appear only on the "other instances" slide.

The seed-42 WorldSmall GA extraction is not used. The paper's headline numbers, the Fig. 2 example run, the other-instance runs and the PSO WorldLarge solution are four separate families of results, kept apart on screen and by tests.

Design rules live in `../IMPLEMENTATION_PLAN.md`, deviations in `PLAN_NOTES.md`, review artefacts in `review/`, the rehearsal checklist in `REHEARSAL.md`, and the content sign-off table in `review/CONTENT_REVIEW.md`.
