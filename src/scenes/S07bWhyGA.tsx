import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const rows = [
  { n: '01', k: 'It explores huge search spaces', d: 'A population of candidate networks evolves together, so the search is never tied to one path.', c: cite('holland1992', 'bartz2014') },
  { n: '02', k: 'It decides routes, fleet and cargo at once', d: 'One encoding covers vessel assignment, route construction and cargo routing, and keeps solutions diverse.', c: '' },
  { n: '03', k: 'It handles objectives and constraints flexibly', d: 'Profit, delivery and fleet limits can all live in the fitness score.', c: '' },
  { n: '04', k: 'It already works on this problem', d: 'A GA has handled liner network design even with emission control areas.', c: cite('cariou2018') },
]

export function S07bWhyGA({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>Why GA?</Reveal>
      {rows.map((r, i) => (
        <Reveal key={r.n} show={step >= i} style={abs(120, 270 + i * 200, { width: 1680 })}>
          <span className="mono" style={{ ...T.label, color: i === 3 ? 'var(--cobalt)' : 'var(--muted)', position: 'absolute', left: 0, top: 14 }}>{r.n}</span>
          <div style={{ marginLeft: 110 }}>
            <div style={{ ...T.h2, fontSize: 52 }}>{r.k}</div>
            <div style={{ ...T.body, fontSize: 30, color: 'var(--ink-2)', marginTop: 6 }}>{r.d}</div>
            {r.c && <div style={{ ...T.label, fontSize: 24, fontWeight: 400, color: 'var(--muted)', marginTop: 6 }}>{r.c}</div>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
