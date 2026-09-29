import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(path.resolve('src/styles/tokens.css'), 'utf8')
const block = (sel: RegExp) => {
  const m = css.match(sel)
  if (!m) throw new Error('theme block not found')
  return Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((x) => [x[1], x[2]]))
}
const themes = {
  light: block(/:root,\s*:root\[data-theme='light'\]\s*\{([^}]*)\}/),
  dark: block(/:root\[data-theme='dark'\]\s*\{([^}]*)\}/),
}
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

describe('theme contrast on the stage background', () => {
  for (const [name, t] of Object.entries(themes)) {
    it(`${name}: all text colours reach 4.5:1`, () => {
      for (const k of ['ink', 'ink-2', 'muted', 'cobalt', 'violet', 'neg']) {
        expect(ratio(t[k], t.bg), `${name} ${k}`).toBeGreaterThanOrEqual(4.5)
      }
    })
  }
})
