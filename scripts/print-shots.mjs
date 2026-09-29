import { chromium } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const [,, pages = '', theme = 'light'] = process.argv
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
const errs = []
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => m.type() === 'error' && errs.push(m.text()))
await p.goto(pathToFileURL(path.resolve('dist/index.html')).href + `?print&theme=${theme}`)
await p.waitForSelector('[data-ready="true"]'); await p.waitForTimeout(600)
const n = await p.locator('.print-page').count()
console.log('pages', n, 'errors', errs)
for (const i of pages.split(',').filter(Boolean).map(Number)) await p.locator('.print-page').nth(i - 1).screenshot({ path: `review/print-${theme}-p${i}.png` })
await b.close()
