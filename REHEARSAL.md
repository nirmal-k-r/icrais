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
6. [ ] **Export**: 28 pages in order, final states, no controls, no appendix.
7. [ ] **Reduced motion**: **M** → reduce; same sequence and information via instant changes.

## Timing run (target 12:40 of a 15:00 slot)
Log your actual time per scene in the last column.

| # | Scene | Steps | Target s | Cumulative | Actual |
|---|---|---|---|---|---|
| | **Act 1 · The question** | | | | |
| 1 | Title | 2 | 20 | 0:20 | |
| 2 | The question | 4 | 30 | 0:50 | |
| 3 | GA + LSNDP | 3 | 15 | 1:05 | |
| 4 | The problem | 5 | 40 | 1:45 | |
| 5 | Why methods struggle | 3 | 25 | 2:10 | |
| | **Act 2 · Why the larger case** | | | | |
| 6 | Why WorldSmall? | 3 | 30 | 2:40 | |
| 7 | Baseline GA | 2 | 20 | 3:00 | |
| | **Act 3 · The contribution** | | | | |
| 8 | What we propose | 4 | 25 | 3:25 | |
| 9 | Four service tiers | 5 | 40 | 4:05 | |
| 10 | Cargo journey | 4 | 25 | 4:30 | |
| 11 | Chromosome | 4 | 40 | 5:10 | |
| | **Act 4 · How the search chooses** | | | | |
| 12 | Two objectives | 3 | 20 | 5:30 | |
| 13 | Fitness score | 5 | 40 | 6:10 | |
| 14 | Fleet penalty | 3 | 25 | 6:35 | |
| 15 | Genetic search | 4 | 35 | 7:10 | |
| | **Act 5 · What the results show** | | | | |
| 16 | Reported results | 4 | 35 | 7:45 | |
| 17 | Convergence | 5 | 45 | 8:30 | |
| 18 | Cost evolution | 3 | 30 | 9:00 | |
| 19 | Cost breakdown | 3 | 20 | 9:20 | |
| 20 | Regional delivery | 3 | 25 | 9:45 | |
| 21 | Fleet | 2 | 15 | 10:00 | |
| 22 | Published results | 3 | 25 | 10:25 | |
| 23 | Other instances | 3 | 25 | 10:50 | |
| | **Act 6 · Closing** | | | | |
| 24 | Algorithmic lessons | 4 | 30 | 11:20 | |
| 25 | What we learned | 3 | 30 | 11:50 | |
| 26 | What next | 3 | 20 | 12:10 | |
| 27 | Close | 3 | 25 | 12:35 | |
| 28 | Thank you | 2 | 5 | 12:40 | |

If you overrun, cut in this order: *Other instances* (scene 23), *Fleet* (scene 21), then *GA + LSNDP* (scene 3), then *Cost breakdown* (scene 19). Remove a scene by deleting its line in `src/content/scenes.ts` and rebuilding (its speaker note can stay).

## Sign-off
- [ ] `review/CONTENT_REVIEW.md` ticked row by row (claims match what you will say and defend).
- [ ] Q&A notes read (last page of the speaker-notes PDF).
