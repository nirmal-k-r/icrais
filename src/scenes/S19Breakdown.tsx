import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { ProvenanceCue } from '../components/ProvenanceCue'
import { Reveal, RevealG } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const rows = [
  { k: 'Fuel', id: 'run.cost.bunker', color: 'var(--cobalt)' },
  { k: 'Handling', id: 'run.cost.handling', color: 'var(--violet)' },
  { k: 'Time charter', id: 'run.cost.tc', color: 'var(--ink)' },
  { k: 'Canal', id: 'run.cost.canal', color: 'var(--muted)' },
  { k: 'Port calls', id: 'run.cost.port', color: 'var(--muted)' },
]
const X0 = 420, PPM = 8.4, ROW = 104, Y0 = 290

export function S19Breakdown({ step }: SceneProps) {
  const d = useDur()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>Operating cost at the final generation</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {rows.map((r, i) => {
          const y = Y0 + i * ROW
          const w = num(r.id) * PPM
          return (
            <g key={r.k}>
              <text x={X0 - 24} y={y + 42} fontSize={32} fontWeight={600} textAnchor="end" fill="var(--ink)">{r.k}</text>
              <motion.rect x={X0} y={y} height={58} fill={r.color} initial={{ width: 0 }} animate={{ width: w }} transition={{ duration: d(0.9), delay: d(0.15 + i * 0.12), ease }} />
              <RevealG show delay={0.9 + i * 0.12}>
                <text x={X0 + w + 20} y={y + 42} fontSize={32} fontWeight={700} fill={r.color === 'var(--muted)' ? 'var(--ink-2)' : r.color}>{claim(r.id)}</text>
                <text x={X0 + w + 20 + 150} y={y + 42} fontSize={26} fill="var(--muted)">{claim(r.id + '.pct')}</text>
              </RevealG>
            </g>
          )
        })}
        <RevealG show={step >= 1}>
          <path d={`M1330 ${Y0} H1350 V${Y0 + 2 * ROW + 58} H1330`} fill="none" stroke="var(--ink)" strokeWidth={3} />
          <text x={1376} y={Y0 + ROW + 24} fontSize={30} fontWeight={600} fill="var(--ink)">{claim('run.top3Share')}</text>
        </RevealG>
      </svg>
      <Reveal show={step >= 2} style={abs(120, 860, { width: 1680, fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em' })}>
        <span style={{ color: 'var(--violet)' }}>Revenue {claim('run.revenue')}</span>
        <span style={{ color: 'var(--muted)' }}>{'  −  '}</span>
        <span>Cost {claim('run.cost')}</span>
        <span style={{ color: 'var(--muted)' }}>{'  ≈  '}</span>
        <span style={{ color: 'var(--cobalt)' }}>{claim('run.profit')} model profit</span>
      </Reveal>
      <Reveal show={step >= 2} delay={0.3} style={abs(120, 950, { ...T.label, fontWeight: 400, color: 'var(--muted)', width: 1500 })}>{claim('run.roundingNote')}</Reveal>
      <ProvenanceCue kind="figrun" y={1010} />
    </div>
  )
}
