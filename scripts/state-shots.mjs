// usage: node scripts/state-shots.mjs theme id/step [id/step ...]  → review/state-<id>-<step>-<theme>.png
import { chromium } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const [,, theme, ...states] = process.argv
const url = pathToFileURL(path.resolve('dist/index.html')).href
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } })
const p0 = await ctx.newPage()
await p0.goto(url); await p0.evaluate((t) => localStorage.setItem('theme', t), theme); await p0.close()
await Promise.all(states.map(async (st) => {
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', (e) => errs.push(String(e)))
  await p.goto(`${url}#/${st}`)
  await p.waitForFunction(() => location.hash.startsWith('#/'))
  await p.waitForTimeout(st.startsWith('close/2') ? 9500 : 6500)
  await p.screenshot({ path: `review/state-${st.replace('/', '-')}-${theme}.png` })
  if (errs.length) console.log(st, errs)
  await p.close()
}))
await b.close()
console.log('done')
