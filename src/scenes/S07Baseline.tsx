import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { SvgText } from '../components/network/parts'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const base = 900
const maxH = 600
const barW = 220
const bars = [
  { name: 'Baltic', id: 'paper.baselineBaltic', x: 340, color: 'var(--muted)', at: 0 },
  { name: 'WorldSmall', id: 'paper.baselineWS', x: 740, color: 'var(--violet)', at: 1 },
]

export function S07Baseline({ step }: SceneProps) {
  const d = useDur()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>But a baseline GA is not enough</Reveal>
      <Reveal show delay={0.2} style={abs(120, 176, { ...T.body, fontSize: 28, color: 'var(--ink-2)' })}>Same baseline GA, same profit-and-delivery objective: demand delivered on two instances.</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={260} x2={1040} y1={base - (t / 100) * maxH} y2={base - (t / 100) * maxH} stroke="var(--hair)" strokeWidth={1.5} />
            <text x={240} y={base - (t / 100) * maxH + 8} fontSize={22} fill="var(--muted)" textAnchor="end">{`${t}%`}</text>
          </g>
        ))}
        {bars.map((b) => {
          const v = num(b.id)
          const h = (v / 100) * maxH
          const on = step >= b.at
          return (
            <g key={b.name}>
              <motion.rect
                x={b.x} width={barW} fill={b.color}
                initial={{ y: base, height: 0 }}
                animate={{ y: on ? base - h : base, height: on ? h : 0 }}
                transition={{ duration: d(on ? 1.0 : 0.3), ease }}
              />
              <RevealG show={on} delay={0.9}>
                <text x={b.x + barW / 2} y={base - h - 18} fontSize={52} fontWeight={700} fill={b.color} textAnchor="middle">{claim(b.id)}</text>
              </RevealG>
              <SvgText x={b.x + barW / 2} y={base + 40} anchor="middle" size={26} fill="var(--ink)" weight={600}>{b.name}</SvgText>
            </g>
          )
        })}
        <RevealG show={step >= 1} delay={1.2}>
          <path d="M1180 700 H1010 M1028 688 L1010 700 L1028 712" fill="none" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </RevealG>
      </svg>
      <Reveal show={step >= 1} delay={1.2} style={abs(1210, 640, { width: 590 })}>
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em' }}>Profitable but sparse</div>
        <div style={{ ...T.body, fontSize: 28, color: 'var(--ink-2)', marginTop: 10 }}>It converged early on networks with few vessels deployed and left most demand unserved.</div>
      </Reveal>
    </div>
  )
}
