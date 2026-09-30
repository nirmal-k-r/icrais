import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const rows = [
  { k: 'Transit-time constraints', d: `for time-sensitive cargo such as food (${cite('hellsten2021', 'karsten2017b')})` },
  { k: 'Vessel speed optimisation', d: `speed per route, trading fuel against time (${cite('psaraftis2013')})` },
  { k: 'Hybrid metaheuristics', d: `pairing the GA with other search methods (${cite('blum2011', 'krogsgaard2018')})` },
]

export function S24Next({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>What we tackle next</Reveal>
      {rows.map((r, i) => (
        <Reveal key={r.k} show={step >= i} style={abs(120, 320 + i * 200, { width: 1680 })}>
          <div className="mono" style={{ ...T.label, color: 'var(--muted)', position: 'absolute', left: 0, top: 22 }}>0{i + 1}</div>
          <div style={{ marginLeft: 110 }}>
            <div style={{ ...T.h2, fontSize: 64 }}>{r.k}</div>
            <div style={{ ...T.body, color: 'var(--muted)', marginTop: 6 }}>{r.d}</div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
