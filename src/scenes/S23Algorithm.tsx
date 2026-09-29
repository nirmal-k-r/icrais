import type { SceneProps } from '../content/scenes'
import { claim } from '../content/claims'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const rows = [
  { n: '01', k: 'Reward what you want delivered', d: 'Adding delivery to the fitness stopped the search settling on sparse but profitable networks.', c: 'var(--violet)' },
  { n: '02', k: 'Start from demand, not from chance', d: 'Demand-guided construction hands the GA connected networks to improve on.', c: 'var(--cobalt)' },
  { n: '03', k: 'Recombine whole routes', d: 'Crossover inherits complete vessel routes from either parent, so good route structures survive.', c: 'var(--ink)' },
  { n: '04', k: 'Explore early, then refine', d: `Adaptive mutation and ${claim('cfg.elites')} elites keep strong networks while the search moves on.`, c: 'var(--muted)' },
]

export function S23Algorithm({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>What the algorithm taught us</Reveal>
      {rows.map((r, i) => (
        <Reveal key={r.n} show={step >= i} style={abs(120, 260 + i * 185, { width: 1680 })}>
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
