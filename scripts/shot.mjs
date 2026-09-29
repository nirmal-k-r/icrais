import { chromium } from '@playwright/test'
import path from 'node:path'
const [,, url, out, w = '1920', h = '1080'] = process.argv
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, offline: true })
const p = await ctx.newPage()
const errs = []
p.on('console', m => m.type() === 'error' && errs.push(m.text()))
p.on('pageerror', e => errs.push(String(e)))
await p.goto(url.startsWith('http') || url.startsWith('file') ? url : 'file://' + path.resolve(url))
await p.waitForTimeout(500)
await p.screenshot({ path: out })
console.log('errors:', errs)
await b.close()
