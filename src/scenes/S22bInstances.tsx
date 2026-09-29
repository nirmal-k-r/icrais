import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import instances from '../data/instances.json'
import { Reveal, RevealG } from '../components/Reveal'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const BASE = 780, MAXH = 400, BW = 96, X0 = 230, PITCH = 250

export function S22bInstances({ step }: SceneProps) {
  const d = useDur()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>The architecture on other instances</Reveal>
      <Reveal show delay={0.2} style={abs(120, 176, { ...T.body, fontSize: 28, color: 'var(--muted)', width: 1680 })}>
        Baseline GA against Multi-Tier GA on smaller LINER-LIB instances. One run each with settings scaled from WorldSmall.
      </Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {[0, 50, 100].map((t) => (
          <g key={t}>
            <line x1={190} x2={1190} y1={BASE - (t / 100) * MAXH} y2={BASE - (t / 100) * MAXH} stroke="var(--hair)" strokeWidth={1.5} />
            <text x={172} y={BASE - (t / 100) * MAXH + 8} fontSize={22} fill="var(--muted)" textAnchor="end">{`${t}%`}</text>
          </g>
        ))}
        <text x={190} y={BASE - MAXH - 34} fontSize={24} fontWeight={600} fill="var(--ink)">Demand delivered</text>
        <rect x={700} y={BASE - MAXH - 52} width={20} height={20} fill="var(--muted)" />
        <text x={730} y={BASE - MAXH - 34} fontSize={22} fill="var(--ink-2)">Baseline GA</text>
        <rect x={880} y={BASE - MAXH - 52} width={20} height={20} fill="var(--violet)" />
        <text x={910} y={BASE - MAXH - 34} fontSize={22} fill="var(--ink-2)">Multi-Tier GA</text>
        {instances.map((inst, i) => {
          const x = X0 + i * PITCH
          const bars = [
            { side: 'base' as const, x, color: 'var(--muted)', on: step >= 0, delay: 0.1 + i * 0.1 },
            { side: 'mt' as const, x: x + BW + 12, color: 'var(--violet)', on: step >= 1, delay: 0.1 + i * 0.1 },
          ]
          return (
            <g key={inst.name}>
              {bars.map((b) => {
                const id = `exp.${inst.name}.${b.side}.delivery`
                const h = Math.max((num(id) / 100) * MAXH, 3)
                return (
                  <g key={b.side}>
                    <motion.rect x={b.x} width={BW} fill={b.color} initial={{ y: BASE, height: 0 }}
                      animate={{ y: b.on ? BASE - h : BASE, height: b.on ? h : 0 }}
                      transition={{ duration: d(b.on ? 0.9 : 0.3), delay: d(b.on ? b.delay : 0), ease }} />
                    <RevealG show={b.on} delay={b.delay + 0.8}>
                      <text x={b.x + BW / 2} y={BASE - h - 14} fontSize={30} fontWeight={700} fill={b.side === 'mt' ? 'var(--violet)' : 'var(--ink-2)'} textAnchor="middle">{claim(id)}</text>
                    </RevealG>
                  </g>
                )
              })}
              <text x={x + BW + 6} y={BASE + 42} fontSize={26} fontWeight={600} fill="var(--ink)" textAnchor="middle">{inst.name}</text>
              <text x={x + BW + 6} y={BASE + 72} fontSize={21} fill="var(--muted)" textAnchor="middle">{claim(`exp.${inst.name}.ports`)} ports</text>
              <text x={x + BW + 6} y={BASE + 98} fontSize={21} fill="var(--muted)" textAnchor="middle">{claim(`exp.${inst.name}.vessels`)} vessels</text>
            </g>
          )
        })}
      </svg>
      <Reveal show={step >= 2} style={abs(1290, 330, { width: 510 })}>
        <div style={{ ...T.label, color: 'var(--muted)', fontWeight: 400, marginBottom: 18 }}>Profit per week ($M)</div>
        {instances.map((inst, i) => {
          const base = claim(`exp.${inst.name}.base.profit`)
          const mt = claim(`exp.${inst.name}.mt.profit`)
          return (
            <Reveal key={inst.name} show={step >= 2} delay={0.15 + i * 0.12} style={{ marginBottom: 30 }}>
              <div style={{ ...T.label, fontWeight: 600 }}>{inst.name}</div>
              <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--muted)' }}>{base}</span>
                <span style={{ color: 'var(--muted)', fontWeight: 300 }}>{'  →  '}</span>
                <span style={{ color: 'var(--cobalt)' }}>{mt}</span>
              </div>
            </Reveal>
          )
        })}
      </Reveal>
      <Reveal show={step >= 2} delay={0.7} style={abs(120, 925, { width: 1680 })}>
        <div style={{ ...T.body, fontSize: 30, color: 'var(--ink)' }}>Delivery rises on every instance. Profit improves on three of the four and falls on Mediterranean.</div>
        <div style={{ ...T.body, fontSize: 26, color: 'var(--muted)', marginTop: 6 }}>These extra runs are not in the published results.</div>
      </Reveal>
    </div>
  )
}
