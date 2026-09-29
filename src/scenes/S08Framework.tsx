import type { SceneProps } from '../content/scenes'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const rows = [
  { n: '01', k: 'Profit and delivery in one fitness score', d: 'Two objectives combined with explicit weights.', c: 'var(--ink)' },
  { n: '02', k: 'A four-tier service architecture', d: 'Direct, trunk, feeder, regional loop.', c: 'var(--cobalt)' },
  { n: '03', k: 'Demand-aware initialisation', d: 'Start from routes that demand justifies.', c: 'var(--violet)' },
  { n: '04', k: 'Adaptive mutation and elitism', d: 'Explore early, refine late, keep the best.', c: 'var(--ink)' },
]

export function S08Framework({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>What we propose</Reveal>
      {rows.map((r, i) => (
        <Reveal key={r.n} show={step >= i} style={abs(120, 270 + i * 175, { width: 1680 })}>
          <span className="mono" style={{ ...T.label, color: r.c, position: 'absolute', left: 0, top: 14 }}>{r.n}</span>
          <div style={{ marginLeft: 110 }}>
            <div style={{ ...T.h2, fontSize: 52 }}>{r.k}</div>
            <div style={{ ...T.body, fontSize: 30, color: 'var(--muted)', marginTop: 6 }}>{r.d}</div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
