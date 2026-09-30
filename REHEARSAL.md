# Rehearsal checklist

## Before you go on stage
- [ ] `npm run build`, then open `dist/index.html` by double-click with Wi-Fi **off** (no server needed). Keep a copy of `dist/` on a USB stick.
- [ ] Backup: `npm run show` (serves `dist` at http://localhost:4173).
- [ ] Press **F** for fullscreen; **Esc** leaves fullscreen without losing your place. Press **?** to see all keys.
- [ ] Light theme is the default (best on a projector). **T**, or the Dark mode / Light mode button in the bottom bar, switches theme without losing position.
- [ ] Projector / 1080p mirror check from the back of the room: can you read axis labels and the small provenance cues (bottom-left)?
- [ ] Try the backup browser (Safari or Firefox) on `dist/index.html`.
- [ ] PDF for sharing: `npm run export:pdf` → `exports/` (light, dark, speaker-notes).

## Keys
→ / Space / PgDn / ↓ **next slide** (or swipe left on a touchscreen); the builds inside each slide play by themselves · ← / PgUp / ↑ previous slide, shown complete (or swipe right) · **S** automatic or manual reveals · **Enter** replay this slide · Home / End · **Shift + → / ←** (or **[** and **]**) jump a whole scene · drag the **bottom slider** to scrub scenes · **O** overview (click a scene to jump) · **B** black screen · **M** motion: system → reduce → full · **R R** restart · **P** print/PDF view.

## Acceptance scenarios (SRS §11)
1. [ ] **Opening**: fresh offline load → fullscreen → question, pause, vignette; no browser chrome, no footer.
2. [ ] **Explanation**: with → and ← only: four tiers, cargo journey, chromosome, fitness, 40-vessel penalty. Reversing reconstructs the previous state.
3. [ ] **Results**: the paper values (≈ 91%, 15.9%, $37.2M) are labelled *Reported in the paper*; $36.2M / 92.0% / 168 are labelled *Example run (paper Fig. 2)*; nothing exploratory appears.
4. [ ] **Interruption**: during an animation press → → ← quickly; the show lands on a coherent state. Jump to the conclusion from the overview (O).
5. [ ] **Projection**: every scene legible at 1080p; **T** toggles dark without resetting progress.
6. [ ] **Export**: 32 pages in order, final states, no controls, no appendix.
7. [ ] **Reduced motion**: **M** → reduce; same sequence and information via instant changes.

## Timing run (target 14:10 of a 15:00 slot)
Log your actual time per scene in the last column.

| # | Scene | Steps | Target s | Cumulative | Actual |
|---|---|---|---|---|---|
| | **Act 1 · The question** | | | | |
| 1 | Title | 2 | 20 | 0:20 | |
| 2 | The question | 4 | 30 | 0:50 | |
| 3 | GA + LSNDP | 3 | 15 | 1:05 | |
| 4 | The problem | 5 | 40 | 1:45 | |
| 5 | Why methods struggle | 3 | 25 | 2:10 | |
| 6 | Related work | 4 | 25 | 2:35 | |
| | **Act 2 · Why the larger case** | | | | |
| 7 | Why WorldSmall? | 3 | 30 | 3:05 | |
| 8 | Why GA? | 4 | 25 | 3:30 | |
| 9 | Baseline GA not enough | 2 | 20 | 3:50 | |
| | **Act 3 · The contribution** | | | | |
| 10 | What we propose | 4 | 25 | 4:15 | |
| 11 | Four service tiers | 5 | 40 | 4:55 | |
| 12 | Cargo journey | 4 | 25 | 5:20 | |
| 13 | Chromosome | 4 | 40 | 6:00 | |
| | **Act 4 · How the search chooses** | | | | |
| 14 | Two objectives | 3 | 20 | 6:20 | |
| 15 | Fitness score | 5 | 40 | 7:00 | |
| 16 | Fleet penalty | 3 | 25 | 7:25 | |
| 17 | Genetic search | 4 | 35 | 8:00 | |
| | **Act 5 · What the results show** | | | | |
| 18 | Reported results | 4 | 35 | 8:35 | |
| 19 | A WorldLarge solution | 5 | 40 | 9:15 | |
| 20 | Convergence | 5 | 45 | 10:00 | |
| 21 | Cost evolution | 3 | 30 | 10:30 | |
| 22 | Cost breakdown | 3 | 20 | 10:50 | |
| 23 | Regional delivery | 3 | 25 | 11:15 | |
| 24 | Fleet | 2 | 15 | 11:30 | |
| 25 | Published results | 3 | 25 | 11:55 | |
| 26 | Other instances | 3 | 25 | 12:20 | |
| | **Act 6 · Closing** | | | | |
| 27 | Algorithmic lessons | 4 | 30 | 12:50 | |
| 28 | What we learned | 3 | 30 | 13:20 | |
| 29 | What next | 3 | 20 | 13:40 | |
| 30 | Close | 3 | 25 | 14:05 | |
| 31 | References | 1 | 0 | 14:05 | |
| 32 | Thank you | 2 | 5 | 14:10 | |

If you overrun, cut in this order: *Other instances*, *Fleet*, *GA + LSNDP*, then *Cost breakdown* (find them in the table above). *Related work* is the next candidate if you still need time.

## Sign-off
- [ ] `review/CONTENT_REVIEW.md` ticked row by row (claims match what you will say and defend).
- [ ] Q&A notes read (last page of the speaker-notes PDF).
