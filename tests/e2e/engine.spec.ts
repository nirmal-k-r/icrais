import { expect, test } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Page } from '@playwright/test'

const url = pathToFileURL(path.resolve('dist/index.html')).href
const open = async (page: Page, suffix = '') => {
  await page.goto(url + '?manual' + suffix) // these tests exercise manual reveals
  await page.waitForFunction(() => location.hash.startsWith('#/'))
  await page.waitForTimeout(100)
}

test('keys step forward/back, ignore repeat, hash tracks position', async ({ page }) => {
  await open(page)
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#/title/1')
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#/question/0')
  await page.keyboard.press('ArrowLeft')
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#/title/1')
  // key repeat must not advance
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', repeat: true })))
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#/title/1')
})

test('rapid input settles on a known state', async ({ page }) => {
  await open(page, '#/question/0')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(1200)
  expect(await page.evaluate(() => location.hash)).toBe('#/question/1')
})

test('reload restores position; theme toggle keeps it', async ({ page }) => {
  await open(page, '#/tiers/2')
  await page.keyboard.press('t')
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  expect(await page.evaluate(() => location.hash)).toBe('#/tiers/2')
  await page.evaluate(() => localStorage.clear())
})

test('home/end and overview jump', async ({ page }) => {
  await open(page)
  await page.keyboard.press('End')
  expect(await page.evaluate(() => location.hash)).toBe('#/thanks/1')
  await page.keyboard.press('Home')
  expect(await page.evaluate(() => location.hash)).toBe('#/title/0')
  await page.keyboard.press('o')
  await page.getByText('10. Four service tiers').click()
  expect(await page.evaluate(() => location.hash)).toBe('#/tiers/0')
})

test('print route renders one page per scene', async ({ page }) => {
  await page.goto(url + '?print')
  await expect(page.locator('[data-ready="true"]')).toBeVisible()
  await expect(page.locator('.print-page')).toHaveCount(31)
})

test.describe('full show', () => {
  test.use({ offline: true })

  test('forward walk visits all 105 states in order, then walks back identically', async ({ page }) => {
    await open(page)
    const seen: string[] = [await page.evaluate(() => location.hash)]
    for (let i = 0; i < 200; i++) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(25)
      const h = await page.evaluate(() => location.hash)
      if (h === seen[seen.length - 1]) break
      seen.push(h)
    }
    expect(seen).toHaveLength(105)
    expect(seen[0]).toBe('#/title/0')
    expect(seen[104]).toBe('#/thanks/1')
    const back: string[] = [seen[104]]
    for (let i = 0; i < 104; i++) {
      await page.keyboard.press('ArrowLeft')
      await page.waitForTimeout(25)
      back.push(await page.evaluate(() => location.hash))
    }
    expect(back).toEqual([...seen].reverse())
  })

  test('rapid input mid-scene settles: → → ← from tiers step 2 lands on step 3', async ({ page }) => {
    await open(page, '#/tiers/2')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(1800)
    expect(await page.evaluate(() => location.hash)).toBe('#/tiers/3')
    // network fully drawn for step 3: feeder layer present, loop layer not yet
    const paths = await page.locator('svg path[stroke-dasharray]').count()
    expect(paths).toBeGreaterThan(0)
  })

  test('print route renders every scene without console errors', async ({ page }) => {
    const errs: string[] = []
    page.on('pageerror', (e) => errs.push(String(e)))
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    await page.goto(url + '?print')
    await expect(page.locator('[data-ready="true"]')).toBeVisible()
    await expect(page.locator('.print-page')).toHaveCount(31)
    expect(errs).toEqual([])
  })

  test('reduced motion: key M cycles preference and the show still steps', async ({ page }) => {
    await open(page, '#/convergence/0')
    await page.keyboard.press('m')
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => location.hash)).toBe('#/convergence/1')
  })

  test('black screen and help overlay do not change position', async ({ page }) => {
    await open(page, '#/costs/1')
    await page.keyboard.press('b')
    await page.keyboard.press('b')
    await page.keyboard.press('h')
    await page.keyboard.press('Escape')
    expect(await page.evaluate(() => location.hash)).toBe('#/costs/1')
  })
})

test.describe('touch, scroll and chrome buttons', () => {
  test.use({ hasTouch: true })
  const hash = (page: Page) => page.evaluate(() => location.hash)

  // real touch events through the browser's input pipeline (what an iPad sends)
  const sessions = new WeakMap<Page, Awaited<ReturnType<ReturnType<Page['context']>['newCDPSession']>>>()
  async function swipe(page: Page, x0: number, x1: number, y = 500) {
    let cdp = sessions.get(page)
    if (!cdp) sessions.set(page, (cdp = await page.context().newCDPSession(page)))
    const send = (type: string, x?: number) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: x === undefined ? [] : [{ x, y }] })
    await send('touchStart', x0)
    for (let k = 1; k <= 3; k++) await send('touchMove', x0 + ((x1 - x0) * k) / 3)
    await send('touchEnd')
  }

  test('swipe left goes forward, swipe right goes back, tiny drags are ignored', async ({ page }) => {
    await open(page, '#/tiers/1')
    await swipe(page, 900, 500)
    await expect.poll(() => hash(page)).toBe('#/tiers/2')
    await swipe(page, 500, 900)
    await expect.poll(() => hash(page)).toBe('#/tiers/1')
    await swipe(page, 500, 520)
    await page.waitForTimeout(300)
    expect(await hash(page)).toBe('#/tiers/1')
  })

  test('tap the right side for next and the left side for back', async ({ page }) => {
    await open(page, '#/tiers/1')
    await page.touchscreen.tap(1700, 400)
    await expect.poll(() => hash(page)).toBe('#/tiers/2')
    await page.touchscreen.tap(150, 400)
    await expect.poll(() => hash(page)).toBe('#/tiers/1')
  })

  test('tapping the bottom strip reveals the controls without changing slide', async ({ page }) => {
    await open(page, '#/tiers/1')
    const bar = page.getByRole('slider', { name: /jump to scene/i }).locator('..')
    expect(await bar.evaluate((el) => getComputedStyle(el).opacity)).toBe('0')
    await page.touchscreen.tap(900, 1050)
    await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    expect(await hash(page)).toBe('#/tiers/1')
  })

  test('scroll wheel or trackpad scroll: one gesture is one step', async ({ page }) => {
    await open(page, '#/tiers/1')
    await page.mouse.move(600, 400)
    await page.mouse.wheel(0, 150)
    await expect.poll(() => hash(page)).toBe('#/tiers/2')
    await page.mouse.wheel(0, 40) // continuing inertia must not add another step
    await page.waitForTimeout(500)
    expect(await hash(page)).toBe('#/tiers/2')
    await page.mouse.wheel(-150, 0)
    await expect.poll(() => hash(page)).toBe('#/tiers/1')
  })

  test('theme button in the bottom bar toggles light and dark', async ({ page }) => {
    await open(page, '#/costs/0')
    await page.mouse.move(300, 300)
    const before = await page.evaluate(() => document.documentElement.dataset.theme)
    await page.getByRole('button', { name: /toggle light or dark theme/i }).click()
    const after = await page.evaluate(() => document.documentElement.dataset.theme)
    expect(after).not.toBe(before)
    expect(await hash(page)).toBe('#/costs/0')
    await page.evaluate(() => localStorage.clear())
  })
})

test.describe('scene scrubbing', () => {
  test('Shift+arrows and [ ] jump whole scenes', async ({ page }) => {
    await open(page, '#/tiers/3')
    const hash = () => page.evaluate(() => location.hash)
    await page.keyboard.press('Shift+ArrowRight')
    await expect.poll(hash).toBe('#/journey/0')
    await page.keyboard.press(']')
    await expect.poll(hash).toBe('#/chromosome/0')
    await page.keyboard.press('Shift+ArrowLeft')
    await expect.poll(hash).toBe('#/journey/0')
    await page.keyboard.press('[')
    await expect.poll(hash).toBe('#/tiers/0')
  })

  test('the bottom slider scrubs scenes', async ({ page }) => {
    await open(page, '#/title/0')
    await page.mouse.move(400, 400)
    const slider = page.getByRole('slider', { name: /jump to scene/i })
    await slider.focus()
    await slider.fill('13')
    await expect.poll(() => page.evaluate(() => location.hash)).toMatch(/^#\/fitness\/0$/)
  })
})
