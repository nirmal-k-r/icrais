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
→ / Space / PgDn / ↓ next reveal (or swipe left on a touchscreen) · ← / PgUp / ↑ back (or swipe right) · Home / End · **Shift + → / ←** (or **[** and **]**) jump a whole scene · drag the **bottom slider** to scrub scenes · **O** overview (click a scene to jump) · **B** black screen · **M** motion: system → reduce → full · **R R** restart · **P** print/PDF view.

## Acceptance scenarios (SRS §11)
1. [ ] **Opening**: fresh offline load → fullscreen → question, pause, vignette; no browser chrome, no footer.
2. [ ] **Explanation**: with → and ← only: four tiers, cargo journey, chromosome, fitness, 40-vessel penalty. Reversing reconstructs the previous state.
3. [ ] **Results**: the paper values (≈ 91%, 15.9%, $37.2M) are labelled *Reported in the paper*; $36.2M / 92.0% / 168 are labelled *Example run (paper Fig. 2)*; nothing exploratory appears.
4. [ ] **Interruption**: during an animation press → → ← quickly; the show lands on a coherent state. Jump to the conclusion from the overview (O).
5. [ ] **Projection**: every scene legible at 1080p; **T** toggles dark without resetting progress.
6. [ ] **Export**: 31 pages in order, final states, no controls, no appendix.
7. [ ] **Reduced motion**: **M** → reduce; same sequence and information via instant changes.

## Timing run (target 13:45 of a 15:00 slot)
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
| 8 | Baseline GA | 2 | 20 | 3:25 | |
| | **Act 3 · The contribution** | | | | |
| 9 | What we propose | 4 | 25 | 3:50 | |
| 10 | Four service tiers | 5 | 40 | 4:30 | |
| 11 | Cargo journey | 4 | 25 | 4:55 | |
| 12 | Chromosome | 4 | 40 | 5:35 | |
| | **Act 4 · How the search chooses** | | | | |
| 13 | Two objectives | 3 | 20 | 5:55 | |
| 14 | Fitness score | 5 | 40 | 6:35 | |
| 15 | Fleet penalty | 3 | 25 | 7:00 | |
| 16 | Genetic search | 4 | 35 | 7:35 | |
| | **Act 5 · What the results show** | | | | |
| 17 | Reported results | 4 | 35 | 8:10 | |
| 18 | A WorldLarge solution | 5 | 40 | 8:50 | |
| 19 | Convergence | 5 | 45 | 9:35 | |
| 20 | Cost evolution | 3 | 30 | 10:05 | |
| 21 | Cost breakdown | 3 | 20 | 10:25 | |
| 22 | Regional delivery | 3 | 25 | 10:50 | |
| 23 | Fleet | 2 | 15 | 11:05 | |
| 24 | Published results | 3 | 25 | 11:30 | |
| 25 | Other instances | 3 | 25 | 11:55 | |
| | **Act 6 · Closing** | | | | |
| 26 | Algorithmic lessons | 4 | 30 | 12:25 | |
| 27 | What we learned | 3 | 30 | 12:55 | |
| 28 | What next | 3 | 20 | 13:15 | |
| 29 | Close | 3 | 25 | 13:40 | |
| 30 | References | 1 | 0 | 13:40 | |
| 31 | Thank you | 2 | 5 | 13:45 | |

If you overrun, cut in this order: *Other instances*, *Fleet*, *GA + LSNDP*, then *Cost breakdown* (find them in the table above). *Related work* is the next candidate if you still need time.

## Sign-off
- [ ] `review/CONTENT_REVIEW.md` ticked row by row (claims match what you will say and defend).
- [ ] Q&A notes read (last page of the speaker-notes PDF).
