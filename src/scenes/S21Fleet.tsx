import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { ProvenanceCue } from '../components/ProvenanceCue'
import { Reveal, RevealG } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const cls = [
  { k: 'Feeder 450', id: 'inst.fleet.Feeder_450', feeder: true },
  { k: 'Feeder 800', id: 'inst.fleet.Feeder_800', feeder: true },
  { k: 'Panamax 1200', id: 'inst.fleet.Panamax_1200', feeder: false },
  { k: 'Panamax 2400', id: 'inst.fleet.Panamax_2400', feeder: false },
  { k: 'Post-Panamax', id: 'inst.fleet.Post_panamax', feeder: false },
  { k: 'Super-Panamax', id: 'inst.fleet.Super_panamax', feeder: false },
]
const BASE = 880, PPV = 6.4, PITCH = 200, BW = 130

export function S21Fleet({ step }: SceneProps) {
  const d = useDur()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>A mixed fleet to allocate</Reveal>
      <Reveal show delay={0.2} style={abs(120, 190, { ...T.label, fontWeight: 400, color: 'var(--muted)' })}>Vessels available by class</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <line x1={110} x2={1330} y1={BASE} y2={BASE} stroke="var(--hair)" strokeWidth={2} />
        {cls.map((c, i) => {
          const h = num(c.id) * PPV
          const x = 130 + i * PITCH
          const col = c.feeder ? 'var(--violet)' : 'var(--cobalt)'
          return (
            <g key={c.k}>
              <motion.rect x={x} width={BW} rx={4} fill={c.feeder ? 'var(--violet-soft)' : 'var(--cobalt-soft)'} stroke={col} strokeWidth={3}
                initial={{ y: BASE, height: 0 }} animate={{ y: BASE - h, height: h }} transition={{ duration: d(0.9), delay: d(0.1 + i * 0.1), ease }} />
              <RevealG show delay={0.8 + i * 0.1}><text x={x + BW / 2} y={BASE - h - 16} fontSize={38} fontWeight={700} textAnchor="middle" fill={col}>{claim(c.id)}</text></RevealG>
              <text x={x + BW / 2} y={BASE + 38} fontSize={22} fontWeight={600} textAnchor="middle" fill="var(--ink)">{c.k}</text>
            </g>
          )
        })}
      </svg>
      <Reveal show={step >= 1} style={abs(1420, 360, { width: 380 })}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>{claim('paper.vessels')} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {claim('inst.vessels')}</span></div>
        <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)', marginTop: 8 }}>deployed in the reported solution</div>
        <div style={{ ...T.body, fontSize: 28, color: 'var(--ink-2)', marginTop: 40 }}>Larger classes carry the trunks whereas smaller ones feed the hubs.</div>
      </Reveal>
      <ProvenanceCue kind="instance" />
    </div>
  )
}
