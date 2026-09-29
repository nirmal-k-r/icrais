import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { CountUp } from '../components/CountUp'
import { Reveal } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const N = num('cfg.minVessels')
const DEPLOYED = num('pen.vessels')
const COLS = 25
const PITCH = 67
const glyph = (i: number) => ({ x: 130 + (i % COLS) * PITCH, y: 470 + Math.floor(i / COLS) * 86 })

function Hull({ filled }: { filled: boolean }) {
  return (
    <g>
      <path d="M-24 -6 H24 L17 12 H-17 Z" fill={filled ? 'var(--ink)' : 'none'} stroke="var(--ink)" strokeWidth={filled ? 0 : 2} opacity={filled ? 1 : 0.5} />
      {filled && <rect x={-14} y={-16} width={18} height={10} fill="var(--violet)" rx={1.5} />}
    </g>
  )
}

export function S14Penalty({ step }: SceneProps) {
  const d = useDur()
  const missing = Array.from({ length: N - DEPLOYED }, (_, k) => DEPLOYED + k)
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>Too few vessels is penalised</Reveal>
      <Reveal show delay={0.2} style={abs(120, 210, { width: 1680 })}>
        <div style={{ ...T.h2, color: 'var(--muted)', fontSize: 38 }}>Below {claim('cfg.minVessels')} vessels</div>
        <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 6 }}>
          Fitness = <span style={{ color: 'var(--cobalt)' }}>Profit</span> − {claim('fit.penaltyPerVessel')} × ({claim('cfg.minVessels')} − vessels used)
        </div>
        <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)', marginTop: 8 }}>No delivery reward in this branch.</div>
      </Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: N }, (_, i) => {
          const p = glyph(i)
          const filled = i < DEPLOYED
          return (
            <motion.g
              key={i}
              style={{ x: p.x, y: p.y }}
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 1 ? 1 : 0 }}
              transition={{ duration: d(0.3), delay: d(step >= 1 ? Math.min(i * 0.02, 1) : 0) }}
            >
              <Hull filled={filled} />
            </motion.g>
          )
        })}
        {missing.map((i, k) => {
          const p = glyph(i)
          return (
            <motion.text
              key={i}
              fontSize={22}
              fontWeight={700}
              fill="var(--cobalt)"
              textAnchor="middle"
              initial={{ opacity: 0, x: p.x, y: p.y + 40 }}
              animate={step >= 2 ? { opacity: [0, 1, 0], x: 960, y: [p.y + 40, p.y + 90, 780] } : { opacity: 0, x: p.x, y: p.y + 40 }}
              transition={{ duration: d(step >= 2 ? 1.3 : 0.2), delay: d(step >= 2 ? k * 0.06 : 0), ease }}
            >
              {claim('pen.each')}
            </motion.text>
          )
        })}
      </svg>
      <Reveal show={step >= 1} delay={0.7} style={abs(130, 660, { ...T.label, color: 'var(--ink-2)' })}>{claim('pen.vessels')} vessels deployed</Reveal>
      <Reveal show={step >= 2} delay={1.4} style={abs(0, 760, { width: 1920, textAlign: 'center' })}>
        <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--cobalt)', lineHeight: 1 }}>
          <CountUp to={num('pen.amount')} final={claim('pen.amount')} show={step >= 2} delay={1.4} fmt={(v) => `−$${Math.abs(v).toFixed(1)}M`} />
        </div>
        <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)', marginTop: 6 }}>{claim('pen.below')} below the threshold</div>
      </Reveal>
    </div>
  )
}
