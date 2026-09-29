import { expect, test } from '@playwright/test'
import { spawn, type ChildProcess } from 'node:child_process'

const PORT = 4181
const site = `http://127.0.0.1:${PORT}`
let server: ChildProcess

test.beforeAll(async () => {
  server = spawn('node', ['server/server.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' })
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`${site}/health`)).ok) return } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('server did not start')
})
test.afterAll(() => { server?.kill() })

test('the server serves the slides, the phone remote, and does not leak files', async ({ request }) => {
  const home = await request.get(`${site}/`)
  expect(home.status()).toBe(200)
  expect(await home.text()).toContain('<title>')
  const remote = await request.get(`${site}/remote`)
  expect(remote.status()).toBe(200)
  expect(await remote.text()).toContain('Next')
  const sneaky = await request.get(`${site}/..%2Fserver%2Fserver.mjs`)
  expect(await sneaky.text()).not.toContain('createServer')
})

test('commands from the phone or watch drive a presenter page opened with ?remote', async ({ page, request }) => {
  await page.goto(`${site}/?remote#/tiers/1`)
  await page.waitForFunction(() => location.hash.startsWith('#/'))
  await expect.poll(async () => (await (await request.get(`${site}/health`)).json()).listeners).toBe(1)
  const hash = () => page.evaluate(() => location.hash)

  expect((await request.get(`${site}/cmd/next`)).status()).toBe(200) // what a Shortcut on the watch calls
  await expect.poll(hash).toBe('#/tiers/2')
  await page.waitForTimeout(200)
  expect((await request.post(`${site}/cmd/prev`)).status()).toBe(200)
  await expect.poll(hash).toBe('#/tiers/1')
  await page.waitForTimeout(200)
  expect((await request.get(`${site}/cmd/nextScene`)).status()).toBe(200)
  await expect.poll(hash).toBe('#/journey/0')

  expect((await request.get(`${site}/cmd/explode`)).status()).toBe(400)
  await page.waitForTimeout(300)
  expect(await hash()).toBe('#/journey/0')
})

test('a page opened without ?remote is not controlled (so the audience is unaffected)', async ({ page, request }) => {
  await page.goto(`${site}/#/tiers/1`)
  await page.waitForTimeout(500)
  expect((await (await request.get(`${site}/health`)).json()).listeners).toBe(0)
  await request.get(`${site}/cmd/next`)
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => location.hash)).toBe('#/tiers/1')
})
