# Plan notes: deviations from IMPLEMENTATION_PLAN.md

## Decided by Nirmal (mid-execution, before the Phase 3 gate)
- Port Louis mention in the opening (S02) is **OK**.
- `paper results/v20b_convergence.png` **is paper Figure 2**. The "Example run (paper Fig. 2)" cue is correct.
- Font must be modern and not look like a default AI/Claude UI font → replaced planned Geist with **Hanken Grotesk** (variable, self-hosted via `@fontsource-variable/hanken-grotesk`) + **DM Mono** for code/gene text.
- Animation pace depends on the task (text quick, route drawing medium, network morph slow). Implemented as `dur` tokens in `src/engine/motion.ts` (`fast .25 · base .45 · draw .9 · major 1.2 · chart 1.4`), chosen per element.

## Technical deviations
- The Vite template ships `oxlint` (not ESLint); kept as is.
- Digitised series: all validation checks passed (endpoints within ~1% of axis span; fitness jump 83.7M at gen 97→103; profit crosses 0 at gen 100; delivery stays ≥ 90% from gen 111). No PNG fallback needed. Total cost is derived as revenue − profit because the legend hides its early part; it matches the sum of the five cost series within 0.6%.
- `run.deliveryStableGen` is **111** (plan text said ~115 as a placeholder).
- Loops in the tiers network run around all four secondary ports of a region (not three) so they enclose the feeders instead of crossing them.
- Motion does not update plain (non-motion-value) `style` props after mount on SVG groups; anything toggled per step uses `animate`.

## Execution log
- **Phase 3 gate**: the plan called for a hard stop for review after the prototype. Nirmal's instruction was "continue until you finish", and the gate questions (font, pace, Fig. 2, Port Louis) had already been answered, so Phases 4–7 were built straight through. The look has therefore not had a separate approval; the review screenshots are in `review/`.
- **Phases 0–7 done.** Phase 8 (appendix scene) and Phase 9 (second-screen presenter view) are optional in the plan and were **not built**; nothing in the app or PDFs references them. `?appendix` and the `A` key exist in the engine but there are no appendix scenes registered.
- **Scene count**: 25 scenes / 88 steps / 11 min 45 s target (asserted by a unit test).

## Verified
- 20 unit tests (navigation reducer; every claim quote found in `sources/paper.txt` or `solver_ga_v20_b.py`; scene registry, timing, claim-id validity, no mixing of figure-run and paper claims outside `regions`; no literal quantities or banned words in scene code; WCAG 4.5:1 for all text tokens in both themes).
- 10 e2e tests in an offline browser context from `file://`: full 88-state walk forward and back, rapid → → ←, key-repeat ignored, reload restores position, theme/overlay do not move position, print route (25 pages, no console errors), reduced-motion key.
- Screenshots of all 88 states in light and dark at 1920×1080; the convergence scene at 1280×720.
- PDFs re-exported: 25 pages each (light, dark), 26 with speaker notes + Q&A; all pages 16:9, none blank.

## Not verified / for Nirmal
- 60 fps on the presenter laptop, real-projector legibility, Safari/Firefox on `dist/index.html`: use `REHEARSAL.md`.
- Content sign-off: `review/CONTENT_REVIEW.md` (rows unticked).
- A timed run: the per-scene targets are estimates, not measured.
- Minor visual nits left as they are: hub labels in the Europe/East-Asia clusters on the world map are close together; the "Port calls" leader in the cost chart sits near the x-axis end.

## Feedback round 1 (review/feedback.md), applied
- Scenes are now **27** (93 steps, ~12:20): added `algorithm` ("What the algorithm taught us") before "What we learned", and a dedicated `thanks` scene. The closing scene now ends on the answer plus vignette.
- **No dot separators** anywhere on screen (title block, unit labels, chart labels, literature labels, cue text joined with "and").
- "Illustrative" cue removed from question, LSNDP, journey, chromosome, penalty and findings. Kept on tiers, challenges (mixed with "Reported in the paper") and the closing vignette.
- Challenges: efficiency chart moved under Efficiency; new visuals for Scalability (performance falling with network size) and Effectiveness (profit high, cargo delivered low). Both are schematic and cued as illustrative; the only number is the paper's 19-port / >10,800 s marker.
- Slide 19: the ledger now uses "≈" and a rounding note ($219.136M − $182.982M = $36.155M), which explains why 219.1 − 183.0 looks like 36.1.
- Slide 20: caption reworded, "Example run (paper Fig. 2)" moved up under the title.
- Wording follows the feedback ("common metric", "Multi-objective optimisation", "which was evaluated together", "whereas smaller ones", new literature caveat).
- New: swipe navigation (touch/pen), Dark/Light mode button in the bottom bar, QR code (verified by decoding it from the exported PDFs) and email nirkramp@gmail.com.
- The chromosome page in the freshly exported PDFs (light and dark) shows no map overlay. The overlay reported earlier most likely came from the previous export, which predates the draw-mask fix.
- Interpretations to confirm: the "slide 25" comma and "whole" items were applied to the matching lines on the headline slide ("which was evaluated together") and the fleet slide ("whereas"); "the example run is very low" on slide 20 was read as the small bottom-left cue and moved beneath the title.

## Feedback round 2, applied
- "Reported in the paper" and "Illustrative" labels removed from every slide. Kept: "Example run (paper Fig. 2)" on the convergence, cost evolution, cost breakdown and fitness-sparkline slides (those values differ from the paper headline, so the label prevents mixing them up) and "WorldSmall instance (LINER-LIB)" on the WorldSmall and fleet slides. Removed from the regional-delivery slide as asked.
- Slide 2 no longer shows "A useful network has to earn and deliver"; the answer now appears only in the closing scene.
- Scene scrubbing: slider in the bottom bar (appears on mouse move), Shift+←/→ and [ ] / , . to jump whole scenes; also in the help overlay.
- 27 scenes, 92 steps.

## Feedback round 3, applied
- **PDF slide "From network to chromosome" showed the network/map behind it in some viewers.** Cause: routes were hidden using SVG masks; the PDF held 271 soft masks and viewers such as macOS Preview ignore them, revealing the hidden routes. Fix: print output now uses no masks or clips, and elements that are hidden in a slide's final state are not rendered at all. The exported PDFs now contain 0 soft masks; the hidden region labels are gone from the page text.
- **Apple Watch / phone remote:** `server/remote.mjs` relay (no dependencies, token protected, pm2 + nginx setup in `docs/REMOTE.md`), `public/remote.html` phone remote, and an opt-in `?remote=<token>` listener in the app. Tested end to end in the browser (16 e2e tests); not tested on a physical watch.

## Feedback round 4, applied
- New slide 23, **"The architecture on other instances"** (28 scenes, 95 steps): Baseline GA vs Multi-Tier GA on Baltic, WAF, Mediterranean and Pacific (delivery bars, then a profit table). Source: `results/results_ga_baseline/comparison.json` (Multi-Tier = the scaled variant, one seed-42 run each), built into `src/data/instances.json` by `scripts/build_instances_data.py`; all figures flow through `exp.*` claims.
- WorldSmall is deliberately not on this slide: the baseline in that folder (1.4% delivery) is a different run from the paper's 15.9%, so mixing them would contradict slide 7.
- All four instances are shown, including the two that stay unprofitable (Mediterranean, Pacific), with an on-slide sentence that the runs are not part of the published results. This is an exception to the "no exploratory numbers in the main show" rule from the SRS, made at Nirmal's request; the unit test now allows `exp.*` claims only on this scene and forbids mixing them with paper or figure-run claims.
- Q&A notes added for why those instances are unprofitable and the uncharged transhipment cost.

- Other-instances slide edited: negative profits no longer red, comma-heavy phrasing removed, caption now says profit improves on three of four (Pacific improves but stays below zero) and falls on Mediterranean.

## Feedback round 5, applied
- **iPad swipe fixed and widened.** Touch now uses real touch events (iPad Safari can drop pointer streams), with swipe (left/right), tap (right side next, left third back), tap on the bottom strip to reveal controls (there is no mouse-move on an iPad), and scroll-wheel/trackpad scroll (one gesture is one step). Synthesised clicks after a handled touch are cancelled so a tap can never hit the slider that just appeared. Verified with real touch events in Chromium and on the WebKit engine with an iPad profile; not on a physical iPad.
- **Simpler server, no tokens.** `server/server.mjs` serves `dist/` and the remote (`/events`, `/cmd/<name>`, `/remote`); nginx just proxies the domain to it. Open the presenter page with `?remote`. Old token relay and `docs/REMOTE.md` removed; the README replaces them.
- `index.html` now has an inline favicon and iPad web-app meta tags; it has no external references.

- Phone remote page got a **watch mode** (silent audio + Media Session): Apple Watch Double Tap and the Now Playing skip buttons drive next/back. Tested that it starts and registers; not on a physical watch.

## Feedback round 6 (academic references), applied
- New `src/content/references.ts` (18 references): 14 taken verbatim from the paper's bibliography (authors and year verified against `sources/paper.txt` by a test), 4 added after a web lookup with DOI or ISBN: Marler and Arora 2004, Psaraftis and Kontovas 2013, Blum et al. 2011, Goldberg 1989. The paper's own entry [26] (Goldberg and Holland 1979) is garbled, so Goldberg 1989 is cited instead; Brouer et al. is cited as 2013 as in the paper although it is in the 2014 volume. Both are worth fixing in the camera-ready version.
- Citations added in place to: problem (NP-hard), challenges (one per column), WorldSmall (LINER-LIB), tiers (hub-and-spoke), fitness (weighted sum), genetic search, published comparison (names now come from the reference labels; the two Karsten 2017 papers are 2017a and 2017b), and what comes next.
- New slide 6 "Related work" (exact methods, hub-and-spoke, metaheuristics and hybrids, this work) and a final "References" slide after Thank you (backup for questions). The speaker-notes PDF gets a references page with DOIs and a Q&A entry on where the references come from.
- 30 scenes, 100 steps, about 13:10 of speaking (the test limit was raised to 14 minutes).

## Feedback round 7, applied
- "References" slide now sits before "Thank you" (the talk ends on Thank you again). Added Kjeldsen 2017 (paper entry [2]) and cited it, with Christiansen et al. 2020, on a new definition line under the LSNDP slide title; the GA + LSNDP intro slide now cites Holland 1992 and Christiansen et al. 2020.
