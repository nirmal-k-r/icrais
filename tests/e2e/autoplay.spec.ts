import { expect, test } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const url = pathToFileURL(path.resolve('dist/index.html')).href
const hash = (page: import('@playwright/test').Page) => page.evaluate(() => location.hash)

test.describe('auto mode (the default): one press is one slide', () => {
  test('the builds inside a slide play by themselves', async ({ page }) => {
    await page.goto(`${url}#/tiers/0`)
    await page.waitForFunction(() => location.hash.startsWith('#/'))
    await expect.poll(() => hash(page), { timeout: 20_000 }).toBe('#/tiers/4')
  })

  test('Next opens the next slide and Back shows the previous one already complete', async ({ page }) => {
    await page.goto(`${url}#/tiers/4`)
    await page.waitForFunction(() => location.hash.startsWith('#/'))
    await page.waitForTimeout(150)
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => hash(page)).toMatch(/^#\/journey\/[0-3]$/)
    await page.keyboard.press('ArrowLeft')
    await expect.poll(() => hash(page)).toBe('#/tiers/4')
    await page.waitForTimeout(2500)
    expect(await hash(page)).toBe('#/tiers/4') // no replay when going back
  })

  test('pressing Next in the middle of a build skips straight to the next slide', async ({ page }) => {
    await page.goto(`${url}#/lsndp/0`)
    await page.waitForFunction(() => location.hash.startsWith('#/'))
    await page.waitForTimeout(400)
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => hash(page)).toMatch(/^#\/challenges\//)
  })

  test('one press per slide walks the whole talk', async ({ page }) => {
    await page.goto(`${url}#/title/0`)
    await page.waitForFunction(() => location.hash.startsWith('#/'))
    const seen: string[] = [(await hash(page)).split('/')[1]]
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(40)
      const id = (await hash(page)).split('/')[1]
      if (id === seen[seen.length - 1]) break
      seen.push(id)
    }
    expect(seen).toHaveLength(32)
    expect(new Set(seen).size).toBe(32)
    expect(seen[31]).toBe('thanks')
  })

  test('S switches to manual reveals and back', async ({ page }) => {
    await page.goto(`${url}#/tiers/0`)
    await page.waitForFunction(() => location.hash.startsWith('#/'))
    await page.keyboard.press('s')
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => hash(page)).toBe('#/tiers/1')
    await page.waitForTimeout(3000)
    expect(await hash(page)).toBe('#/tiers/1') // nothing advances by itself in manual mode
    await page.keyboard.press('s')
    await page.evaluate(() => localStorage.clear())
  })

  test('Enter replays the current slide', async ({ page }) => {
    await page.goto(`${url}#/tiers/4`)
    await page.waitForFunction(() => location.hash.startsWith('#/'))
    await page.keyboard.press('Enter')
    await expect.poll(() => hash(page)).toBe('#/tiers/0')
  })
})
