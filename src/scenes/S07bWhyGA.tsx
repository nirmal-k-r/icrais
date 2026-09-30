import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { Reveal, RevealG } from '../components/Reveal'
import { Port } from '../components/network/parts'
import { tierStyle, type Tier } from '../components/network/tiers'
import { T, abs } from '../styles/type'

const rows = [
  { n: '01', k: 'It explores huge search spaces', d: 'Many candidate networks evolve side by side, so the search is never tied to a single path.', c: cite('holland1992', 'bartz2014') },
  { n: '02', k: 'Its genome fits the problem', d: 'One gene per vessel route covers vessel assignment and route construction, and each network is scored on how it routes cargo.', c: '' },
  { n: '03', k: 'GA solutions already exist', d: 'Genetic algorithms have been applied to liner network design, even with emission control areas.', c: '' },
]
const Y0 = 270
const PITCH = 235

// a fixed cloud of candidate networks (deterministic, so the slide is identical every time)
const cloud = Array.from({ length: 44 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453
  const b = Math.sin(i * 78.233) * 12345.6789
  return { x: 1170 + (a - Math.floor(a)) * 610, y: Y0 + 4 + (b - Math.floor(b)) * 130, best: i % 11 === 3 }
})
// a chromosome: one gene per vessel route, coloured by service tier
const genes: Tier[] = ['direct', 'direct', 'trunk', 'trunk', 'trunk', 'feeder', 'feeder', 'feeder', 'feeder', 'feeder', 'loop', 'loop']

export function S07bWhyGA({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>Why GA?</Reveal>
      {rows.map((r, i) => (
        <Reveal key={r.n} show={step >= i} style={abs(120, Y0 + i * PITCH, { width: 980 })}>
          <span className="mono" style={{ ...T.label, color: i === 2 ? 'var(--cobalt)' : 'var(--muted)', position: 'absolute', left: 0, top: 14 }}>{r.n}</span>
          <div style={{ marginLeft: 100 }}>
            <div style={{ ...T.h2, fontSize: 50 }}>{r.k}</div>
            <div style={{ ...T.body, fontSize: 28, color: 'var(--ink-2)', marginTop: 6 }}>{r.d}</div>
            {r.c && <div style={{ ...T.label, fontSize: 24, fontWeight: 400, color: 'var(--muted)', marginTop: 6 }}>{r.c}</div>}
          </div>
        </Reveal>
      ))}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 01: a population of candidate networks */}
        {cloud.map((p, i) => (
          <Port key={i} p={{ x: p.x, y: p.y }} r={p.best ? 9 : 6} hub={false} show={step >= 0} delay={0.3 + i * 0.02} opacity={p.best ? 1 : 0.45} />
        ))}
        <RevealG show delay={0.6}>
          <text x={1170} y={Y0 + 178} fontSize={22} fill="var(--muted)">A population of candidate networks</text>
        </RevealG>
        {/* 02: the genome, one gene per vessel route */}
        <RevealG show={step >= 1} delay={0.2}>
          {genes.map((t, i) => {
            const st = tierStyle[t]
            return <rect key={i} x={1170 + i * 52} y={Y0 + PITCH + 14} width={44} height={64} rx={4} fill={st.color} fillOpacity={0.14} stroke={st.color} strokeWidth={t === 'trunk' ? 5 : 3} strokeDasharray={st.dash} />
          })}
          <text x={1170} y={Y0 + PITCH + 120} fontSize={22} fill="var(--muted)">One gene per vessel route, grouped by service tier</text>
        </RevealG>
        {/* 03: the reference, large and plain */}
        <RevealG show={step >= 2} delay={0.2}>
          <text x={1170} y={Y0 + 2 * PITCH + 48} fontSize={44} fontWeight={600} fill="var(--ink)">{cite('cariou2018')}</text>
          <text x={1170} y={Y0 + 2 * PITCH + 88} fontSize={24} fill="var(--muted)">GA for liner network design</text>
        </RevealG>
      </svg>
    </div>
  )
}
