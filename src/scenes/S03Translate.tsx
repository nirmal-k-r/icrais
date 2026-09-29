import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Reveal } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T } from '../styles/type'

const big = { fontSize: 96, lineHeight: '101px', fontWeight: 600, letterSpacing: '-0.035em' } as const

/**
 * The old term shrinks into a small label above the new one. Text hugs the "+" on both sides
 * (left block right-aligned, right block left-aligned), so the plus sits exactly between the words.
 */
function Morph({ oldText, newText, color, sub, step, w, align }: {
  oldText: string; newText: string; color: string; sub?: string; step: number; w: number; align: 'left' | 'right'
}) {
  const d = useDur()
  const done = step >= 1
  return (
    <div style={{ position: 'relative', width: w, textAlign: align }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 101, display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <motion.div
          initial={false}
          animate={{ y: done ? -80 : 0, scale: done ? 0.36 : 0.667, opacity: done ? 0.55 : 1 }}
          transition={{ duration: d(0.8), ease }}
          style={{ ...big, whiteSpace: 'nowrap', transformOrigin: `${align} center` }}
        >
          {oldText}
        </motion.div>
      </div>
      <Reveal show={done} delay={0.35} style={{ ...big, color, whiteSpace: 'nowrap' }}>{newText}</Reveal>
      {sub && <Reveal show={done} delay={0.6} style={{ ...T.body, color: 'var(--ink-2)', marginTop: 8 }}>{sub}</Reveal>}
    </div>
  )
}

export function S03Translate({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 56, paddingTop: 440 }}>
      <Morph oldText="Optimisation algorithms" newText="Genetic Algorithm" color="var(--cobalt)" step={step} w={760} align="right" />
      <Reveal show style={{ fontSize: 84, fontWeight: 300, color: 'var(--muted)', lineHeight: '101px' }}>+</Reveal>
      <Morph oldText="Shipping networks" newText="LSNDP" color="var(--violet)" sub="Liner Shipping Network Design Problem" step={step} w={640} align="left" />
    </div>
  )
}
