// Builds the show and prints the deterministic ?print route to PDF (one page per scene, final state).
// usage: npm run export:pdf [-- --appendix]
import { execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const withAppendix = process.argv.includes('--appendix')
execSync('npm run build', { stdio: 'inherit' })
mkdirSync('exports', { recursive: true })
const base = pathToFileURL(path.resolve('dist/index.html')).href

const jobs = [
  { file: 'icrais-2026-multitier-ga.pdf', q: 'print' },
  { file: 'icrais-2026-multitier-ga-dark.pdf', q: 'print&theme=dark' },
  { file: 'icrais-2026-multitier-ga-speaker-notes.pdf', q: 'print&notes' },
  ...(withAppendix ? [{ file: 'icrais-2026-multitier-ga-with-appendix.pdf', q: 'print&appendix' }] : []),
]

const browser = await chromium.launch()
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(`${base}?${j.q}`)
  await page.waitForSelector('[data-ready="true"]')
  await page.waitForTimeout(400)
  await page.pdf({ path: `exports/${j.file}`, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true })
  console.log('wrote', j.file, errors.length ? `(errors: ${errors.join('; ')})` : '')
  await page.close()
}
await browser.close()
