// Generates review/CONTENT_REVIEW.md: every scene's final on-screen text, claim ids and statuses, for Nirmal's sign-off.
// usage: node scripts/content-review.mjs   (needs dist/ built and `npx tsx` for the registry export below)
import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// scene + claim metadata straight from the TypeScript registry
const meta = JSON.parse(
  execSync(
    `npx tsx -e "import {mainScenes} from './src/content/scenes.ts'; import {claims} from './src/content/claims.ts'; const st=Object.fromEntries(claims.map(c=>[c.id,c.status])); console.log(JSON.stringify(mainScenes.map(s=>({id:s.id,act:s.act,title:s.title,steps:s.steps,sec:s.targetSeconds,sources:s.sources.map(x=>x+' ('+st[x]+')')}))))"`,
    { encoding: 'utf8' },
  ).trim().split('\n').pop(),
)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await page.goto(pathToFileURL(path.resolve('dist/index.html')).href + '?print')
await page.waitForSelector('[data-ready="true"]')
await page.waitForTimeout(500)
const texts = await page.evaluate(() =>
  [...document.querySelectorAll('.print-page')].map((pg) => {
    const w = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT)
    const out = []
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.textContent.replace(/\s+/g, ' ').trim()
      if (t) out.push(t)
    }
    return out.join(' | ')
  }),
)
await browser.close()

const total = meta.reduce((t, s) => t + s.sec, 0)
const rows = meta.map((s, i) => `| ☐ | ${i + 1} | \`${s.id}\` | ${s.steps} | ${s.sec} | ${texts[i].replace(/\|/g, '¦').replace(/¦ /g, '· ')} | ${s.sources.join('<br>') || '·'} |`)
const md = `# Content review: sign off before final rehearsal

Tick each row when the **on-screen text and every number** match what you are willing to say and defend.
Final-state text is extracted from the print route (what the PDF shows). Status meanings: **published** = stated in the paper text ·
**figure-run** = the paper Fig. 2 example run · **instance** = LINER-LIB WorldSmall inputs · **illustrative** = conceptual example ·
**derived** = computed from published values.

Target total: ${Math.floor(total / 60)} min ${total % 60} s across ${meta.length} scenes / ${meta.reduce((t, s) => t + s.steps, 0)} reveal steps.

## Things to decide or know
1. The headline says **≈ 91%** (paper 91.5% in Results, 91.2% in the comparison table). The Fig. 2 example run says **92.0% / $36.2M / 168 vessels**. Both are labelled; they are not mixed in one chart.
2. Derived figure **+75.6 percentage points** = 91.5 − 15.9. The paper's own "73.7%" and "12.9%" figures are *not* used because they do not reconcile with the reported values.
3. The fitness scene explains alpha as **1.3M vs 2.2M per delivery point** depending on the sign of profit, plus the **300,000 × (50 − vessels)** fleet penalty (from the solver). There is no "demand-threshold penalty" or "negative-profit penalty" on screen.
4. Port Louis appears **only** in the illustrative opening (WorldSmall does not contain it).
5. Not claimed anywhere: independent feasibility, full-cost validation, global optimality, per-component causal gains.

| OK | # | scene | steps | s | final on-screen text | claims (status) |
|---|---|---|---|---|---|---|
${rows.join('\n')}
`
writeFileSync('review/CONTENT_REVIEW.md', md)
console.log('wrote review/CONTENT_REVIEW.md', meta.length, 'scenes')
