import type { CSSProperties } from 'react'

export const T = {
  statement: { fontSize: 120, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-0.035em' },
  h1: { fontSize: 72, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.03em' },
  h1s: { fontSize: 56, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.03em' },
  h2: { fontSize: 48, lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.02em' },
  body: { fontSize: 32, lineHeight: 1.35, fontWeight: 400 },
  label: { fontSize: 24, lineHeight: 1.3, fontWeight: 500 },
  cue: { fontSize: 18, lineHeight: 1.3, fontWeight: 500, letterSpacing: '0.01em' },
} satisfies Record<string, CSSProperties>

export const abs = (x: number, y: number, extra: CSSProperties = {}): CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  margin: 0,
  ...extra,
})
