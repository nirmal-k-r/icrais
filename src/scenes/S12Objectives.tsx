import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Reveal } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

export function S12Objectives({ step }: SceneProps) {
  const d = useDur()
  const lift = step >= 2 ? -50 : 0
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>Multi-objective optimisation</Reveal>
      <Reveal show delay={0.2} style={abs(120, 190, { ...T.h2, color: 'var(--muted)' })}>Two objectives but different units</Reveal>
      <motion.div initial={false} animate={{ y: lift }} transition={{ duration: d(0.6), ease }}>
        <Reveal show style={abs(120, 330, { width: 780 })}>
          <div style={{ fontSize: 110, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--cobalt)', lineHeight: 1 }}>Profit</div>
          <div style={{ ...T.body, marginTop: 24, color: 'var(--ink-2)' }}>Revenue from cargo and idle-vessel charter, less fuel, vessel and port costs.</div>
          <div className="mono" style={{ ...T.label, marginTop: 20, color: 'var(--muted)' }}>unit: $ per week</div>
        </Reveal>
        <Reveal show={step >= 1} style={abs(1020, 330, { width: 780 })}>
          <div style={{ fontSize: 110, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--violet)', lineHeight: 1 }}>Delivery</div>
          <div style={{ ...T.body, marginTop: 24, color: 'var(--ink-2)' }}>Cargo delivered, as a share of weekly demand.</div>
          <div className="mono" style={{ ...T.label, marginTop: 20, color: 'var(--muted)' }}>unit: % of demand</div>
        </Reveal>
      </motion.div>
      <Reveal show={step >= 2} delay={0.3} style={abs(120, 800, { ...T.h2 })}>So they need a common metric.</Reveal>
    </div>
  )
}
