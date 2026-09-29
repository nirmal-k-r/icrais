import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { CountUp } from '../components/CountUp'
import { Reveal, RevealG } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const X0 = 120, LEN = 960, BH = 70
const xOf = (v: number) => X0 + (v / 100) * LEN
const stats = [
  { id: 'paper.profit', label: 'reported profit', color: 'var(--cobalt)', fmt: (v: number) => `$${v.toFixed(1)}M` },
  { id: 'paper.vessels', label: 'vessels deployed', color: 'var(--ink)', fmt: (v: number) => v.toFixed(0) },
  { id: 'paper.runtime', label: 'average runtime', color: 'var(--ink)', fmt: (v: number) => `${v.toFixed(1)} s` },
]

function Bar({ y, id, color, show, name, delay = 0 }: { y: number; id: string; color: string; show: boolean; name: string; delay?: number }) {
  const d = useDur()
  const v = num(id)
  return (
    <g>
      <text x={X0} y={y - 16} fontSize={28} fontWeight={600} fill="var(--ink)">{name}</text>
      <motion.rect x={X0} y={y} height={BH} fill={color}
        initial={{ width: 0 }} animate={{ width: show ? xOf(v) - X0 : 0 }}
        transition={{ duration: d(show ? 1.1 : 0.3), delay: d(show ? delay : 0), ease }} />
      <RevealG show={show} delay={delay + 0.9}>
        <text x={xOf(v) + 20} y={y + 54} fontSize={52} fontWeight={700} fill={color}>{claim(id === 'paper.delivery' ? 'paper.delivery1dp' : id)}</text>
      </RevealG>
    </g>
  )
}

export function S16Headline({ step }: SceneProps) {
  const yBase = 300
  const yMulti = 510
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>WorldSmall: reported results</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={xOf(t)} x2={xOf(t)} y1={yBase - 20} y2={610} stroke="var(--hair)" strokeWidth={1.5} />
            <text x={xOf(t)} y={644} fontSize={22} fill="var(--muted)" textAnchor="middle">{`${t}%`}</text>
          </g>
        ))}
        <Bar y={yBase} id="paper.baselineWS" color="var(--muted)" show name="Baseline GA" />
        <Bar y={yMulti} id="paper.delivery" color="var(--violet)" show={step >= 1} name="Multi-Tier GA" />
        <RevealG show={step >= 1} delay={1.4}>
          <path d={`M${xOf(num('paper.baselineWS'))} 430 V444 H${xOf(num('paper.delivery'))} V430`} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
          <text x={(xOf(num('paper.baselineWS')) + xOf(num('paper.delivery'))) / 2} y={424} fontSize={26} fontWeight={600} textAnchor="middle" fill="var(--ink)">{claim('paper.deltaPoints')}</text>
        </RevealG>
      </svg>
      <Reveal show={step >= 1} delay={1.0} style={abs(120, 680, { fontSize: 200, fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--violet)', lineHeight: 1 })}>
        {claim('paper.delivery')}
      </Reveal>
      <Reveal show={step >= 1} delay={1.2} style={abs(120, 900, { ...T.label, color: 'var(--muted)' })}>of weekly demand delivered</Reveal>
      {stats.map((s, i) => (
        <Reveal key={s.id} show={step >= 2} delay={i * 0.15} style={abs(1360, 290 + i * 190, { width: 460 })}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: s.color }}>
            <CountUp to={num(s.id)} final={claim(s.id)} show={step >= 2} delay={i * 0.15} fmt={s.fmt} />
          </div>
          <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
        </Reveal>
      ))}
      <Reveal show={step >= 3} style={abs(1360, 880, { ...T.body, fontSize: 28, color: 'var(--ink-2)', width: 440 })}>The complete framework which was evaluated together.</Reveal>
    </div>
  )
}
