// Steps through the built show with the → key and screenshots every state.
// usage: node scripts/review-shots.mjs [theme=light] [w=1920] [h=1080] [onlyScene]
import { chromium } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const [,, theme = 'light', w = '1920', h = '1080', only] = process.argv
const url = pathToFileURL(path.resolve('dist/index.html')).href
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, offline: true })
const p = await ctx.newPage()
const errs = []
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
p.on('pageerror', (e) => errs.push(String(e)))
await p.goto(url)
await p.evaluate((t) => localStorage.setItem('theme', t), theme)
await p.goto(url)
await p.waitForFunction(() => location.hash.startsWith('#/'))
const seen = new Set()
for (let i = 0; i < 400; i++) {
  const hash = await p.evaluate(() => location.hash)
  const [, id, step] = hash.split('/')
  const key = hash
  if (seen.has(key)) break
  seen.add(key)
  const slow = { 'question/3': 5200, 'close/2': 9000, 'close/1': 2600, 'lsndp/2': 4200, 'penalty/2': 3200, 'fitness/0': 2600 }
  const long = slow[`${id}/${step}`] ?? 2300
  await p.waitForTimeout(long)
  if (!only || only === id) await p.screenshot({ path: `review/${String(seen.size).padStart(2, '0')}-${id}-${step}-${theme}${w === '1920' ? '' : '-' + w}.png` })
  await p.keyboard.press('ArrowRight')
  await p.waitForTimeout(60)
}
console.log('states', seen.size, 'errors', errs)
await b.close()
