import { area } from 'd3-shape'
import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import costs from '../data/figrun-costs.json'
import { num } from '../content/claims'
import { ProvenanceCue } from '../components/ProvenanceCue'
import { Reveal, RevealG } from '../components/Reveal'
import { ChartLine, ChartPanel } from '../components/charts/ChartPanel'
import { useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const M = (a: number[]) => a.map((v) => v / 1e6)
const s = { bunker: M(costs.bunker), handling: M(costs.handling), tc: M(costs.tc), canal: M(costs.canal), port: M(costs.port), revenue: M(costs.revenue), total: M(costs.totalCost) }
const fmt = (v: number) => `$${v}M`
const X = { xDomain: [0, 200] as [number, number], xTicks: [0, 50, 100, 150, 200], marginRight: 210, w: 1680 }

export function S18Costs({ step }: SceneProps) {
  const d = useDur()
  const op = (k: 'bunker' | 'tc' | 'handling' | 'other') => {
    if (step !== 1) return 1
    return k === 'other' ? 0.15 : 1
  }
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 70, { ...T.h1s })}>Where the money goes during the search</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <ChartPanel x={120} y={150} h={400} title="Cost components ($ per week)" yDomain={[-40, 290]} yTicks={[0, 100, 200]} fmtY={fmt} show {...X}>
          {(sx, sy, box) => {
            const labels = [
              { v: s.bunker, t: 'Fuel', c: 'var(--cobalt)' }, { v: s.handling, t: 'Handling', c: 'var(--violet)' },
              { v: s.tc, t: 'Time charter', c: 'var(--ink)' }, { v: s.canal, t: 'Canal', c: 'var(--muted)' }, { v: s.port, t: 'Port calls', c: 'var(--muted)' },
            ].map((l) => ({ ...l, y: sy(l.v[199]) })).sort((a, b) => a.y - b.y)
            const natural = labels.map((l) => l.y)
            for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + 27)
            const shift = natural.reduce((t, v) => t + v, 0) / natural.length - labels.reduce((t, l) => t + l.y, 0) / labels.length
            labels.forEach((l) => (l.y += shift))
            return (
              <>
                <ChartLine values={s.bunker} sx={sx} sy={sy} box={box} color="var(--cobalt)" show opacity={op('bunker')} />
                <ChartLine values={s.tc} sx={sx} sy={sy} box={box} color="var(--ink)" show opacity={op('tc')} />
                <ChartLine values={s.handling} sx={sx} sy={sy} box={box} color="var(--violet)" show opacity={op('handling')} />
                <ChartLine values={s.canal} sx={sx} sy={sy} box={box} color="var(--muted)" show opacity={op('other')} width={3} />
                <ChartLine values={s.port} sx={sx} sy={sy} box={box} color="var(--muted)" show dash="3 6" opacity={op('other')} width={3} />
                <RevealG show delay={1.4}>
                  {labels.map((l) => (
                    <g key={l.t}>
                      <line x1={box.x + box.w} x2={box.x + box.w + 10} y1={sy(l.v[199])} y2={l.y} stroke={l.c} strokeWidth={2} />
                      <text x={box.x + box.w + 14} y={l.y + 7} fontSize={22} fontWeight={700} fill={l.c}>{l.t}</text>
                    </g>
                  ))}
                </RevealG>
                <RevealG show={step >= 1} delay={0.5}>
                  <text x={sx(70)} y={sy(205)} fontSize={24} fontWeight={600} fill="var(--cobalt)">Fuel and charter fall as routes get leaner</text>
                  <text x={sx(84)} y={sy(150)} fontSize={24} fontWeight={600} fill="var(--violet)">Handling rises as more cargo is carried</text>
                  <line x1={sx(120)} x2={sx(120)} y1={sy(140)} y2={sy(62)} stroke="var(--violet)" strokeWidth={2} />
                </RevealG>
              </>
            )
          }}
        </ChartPanel>
        {step >= 2 && (
          <ChartPanel x={120} y={560} h={400} title="Revenue and total cost ($ per week)" yDomain={[0, 540]} yTicks={[0, 200, 400]} fmtY={fmt} show {...X}>
            {(sx, sy, box) => {
              const cross = num('run.profitCrossGen')
              const idx = Array.from({ length: 200 - cross }, (_, i) => cross + i)
              const gap = area<number>().x((g) => sx(g)).y0((g) => sy(s.total[g])).y1((g) => sy(s.revenue[g]))(idx)!
              return (
                <>
                  <motion.path d={gap} fill="var(--cobalt-soft)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(0.8), delay: d(1.6) }} />
                  <ChartLine values={s.revenue} sx={sx} sy={sy} box={box} color="var(--violet)" show />
                  <ChartLine values={s.total} sx={sx} sy={sy} box={box} color="var(--ink)" show delay={0.2} />
                  <RevealG show delay={1.6}>
                    <text x={box.x + box.w + 14} y={sy(s.revenue[199]) - 4} fontSize={22} fontWeight={700} fill="var(--violet)">Revenue</text>
                    <text x={box.x + box.w + 14} y={sy(s.total[199]) + 26} fontSize={22} fontWeight={700} fill="var(--ink)">Total cost</text>
                    <text x={sx(150)} y={sy(s.total[150]) - 80} fontSize={24} fontWeight={700} fill="var(--cobalt)" textAnchor="middle">Profit gap</text>
                  </RevealG>
                </>
              )
            }}
          </ChartPanel>
        )}
      </svg>
      <ProvenanceCue kind="figrun" />
    </div>
  )
}
