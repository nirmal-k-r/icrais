import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const rows = [
  { n: '01', k: 'Exact methods', d: 'High-quality solutions, but run time degrades rapidly as networks grow.', c: cite('plum2014', 'brouer2014'), col: 'var(--muted)' },
  { n: '02', k: 'Hub-and-spoke designs', d: 'Scale better, but rely on predefined hubs and simplified routing.', c: cite('zheng2015', 'gelareh2011'), col: 'var(--muted)' },
  { n: '03', k: 'Metaheuristics and hybrids', d: 'Reach global instances such as WorldSmall, but need careful tuning.', c: cite('cariou2018', 'koza2020', 'krogsgaard2018'), col: 'var(--muted)' },
  { n: '04', k: 'This work', d: 'Service tiers built from demand, with delivered cargo rewarded in the search.', c: '', col: 'var(--cobalt)' },
]

export function S05bRelated({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>Related work</Reveal>
      {rows.map((r, i) => (
        <Reveal key={r.n} show={step >= i} style={abs(120, 270 + i * 200, { width: 1680 })}>
          <span className="mono" style={{ ...T.label, color: r.col, position: 'absolute', left: 0, top: 14 }}>{r.n}</span>
          <div style={{ marginLeft: 110 }}>
            <div style={{ ...T.h2, fontSize: 52, color: i === 3 ? 'var(--cobalt)' : 'var(--ink)' }}>{r.k}</div>
            <div style={{ ...T.body, fontSize: 30, color: 'var(--ink-2)', marginTop: 6 }}>{r.d}</div>
            {r.c && <div style={{ ...T.label, fontSize: 24, fontWeight: 400, color: 'var(--muted)', marginTop: 6 }}>{r.c}</div>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
