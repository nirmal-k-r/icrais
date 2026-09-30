import { motion } from 'motion/react'
import { useId } from 'react'
import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { claim, num } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { ChartLine, ChartPanel } from '../components/charts/ChartPanel'
import { SvgText } from '../components/network/parts'
import { easeInOut, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const C = { x: 500, y: 500 }
const R = 190
const names = ['Evaluate', 'Select', 'Crossover', 'Mutate', 'Retain elites']
const pos = names.map((_, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180)
  return { x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a), a }
})
const labelAt = (i: number) => {
  const p = pos[i]
  const dx = Math.cos(p.a)
  return { x: p.x + dx * 26, y: p.y + Math.sin(p.a) * 26 + (Math.sin(p.a) > 0.5 ? 22 : Math.sin(p.a) < -0.5 ? -8 : 8), a: dx > 0.3 ? ('start' as const) : dx < -0.3 ? ('end' as const) : ('middle' as const) }
}
const arc = (i: number) => {
  const a = pos[i], b = pos[(i + 1) % 5]
  const t0 = a.a + 0.2, t1 = b.a - 0.2 + (i === 4 ? 2 * Math.PI : 0)
  const p0 = { x: C.x + R * Math.cos(t0), y: C.y + R * Math.sin(t0) }
  const p1 = { x: C.x + R * Math.cos(t1), y: C.y + R * Math.sin(t1) }
  return `M${p0.x} ${p0.y} A${R} ${R} 0 0 1 ${p1.x} ${p1.y}`
}
const init = { x: 200, y: 290 }

const pattern = ['A', 'B', 'B', 'A', 'A', 'B', 'A', 'B', 'B', 'B', 'A', 'A', 'B', 'A', 'B', 'A']
const BX = 1060, BP = 44, BW = 36
const mutation = Array.from({ length: 200 }, (_, g) => num('mut.start') * 100 * (1 - g / (2 * num('cfg.generations'))))
const cfg: [string, string][] = [
  ['Population', claim('cfg.population')], ['Elites', claim('cfg.elites')], ['Generations', claim('cfg.generations')], ['Stagnation stop', claim('cfg.stagnation')],
  ['Direct threshold', claim('cfg.directThreshold')], ['Direct routes', claim('cfg.directRoutes')], ['Min vessels', claim('cfg.minVessels')], ['Route cycle', claim('cfg.cycleWeeks')],
]

function Row({ y, kind, show, delay = 0 }: { y: number; kind: 'A' | 'B' | 'child'; show: boolean; delay?: number }) {
  return (
    <RevealG show={show} delay={delay}>
      {pattern.map((p, i) => {
        const c = kind === 'child' ? p : kind
        return <rect key={i} x={BX + i * BP} y={y} width={BW} height={40} rx={4} fill={c === 'A' ? 'var(--cobalt-soft)' : 'var(--violet-soft)'} stroke={c === 'A' ? 'var(--cobalt)' : 'var(--violet)'} strokeWidth={2.5} />
      })}
    </RevealG>
  )
}

export function S15Search({ step }: SceneProps) {
  const d = useDur()
  const mk = useId().replace(/:/g, '')
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>Genetic search over vessel routes</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <marker id={mk} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--ink)" />
          </marker>
        </defs>
        {names.map((_, i) => (
          <motion.path key={i} d={arc(i)} fill="none" stroke="var(--ink)" strokeWidth={3} markerEnd={`url(#${mk})`}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: d(0.5), delay: d(0.5 + i * 0.28), ease: easeInOut }} />
        ))}
        {pos.map((p, i) => (
          <g key={i}>
            <RevealG show delay={0.3 + i * 0.28}><circle cx={p.x} cy={p.y} r={11} fill="var(--ink)" /></RevealG>
            <SvgText x={labelAt(i).x} y={labelAt(i).y} anchor={labelAt(i).a} size={30} weight={600} fill="var(--ink)" delay={0.3 + i * 0.28}>{names[i]}</SvgText>
          </g>
        ))}
        <SvgText x={init.x} y={init.y} size={30} weight={600} fill="var(--muted)" delay={0.1}>Initialise</SvgText>
        <motion.path d={`M${init.x + 60} ${init.y + 14} Q${init.x + 130} ${init.y + 90} ${pos[0].x - 30} ${pos[0].y - 10}`} fill="none" stroke="var(--muted)" strokeWidth={3} strokeDasharray="8 7" markerEnd={`url(#${mk})`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d(0.5), delay: d(0.3) }} />

        {/* right side: crossover (step 1) is replaced by the mutation curve (step 2+) */}
        <RevealG show={step === 1}>
          <SvgText x={BX} y={300} size={22}>Parent A</SvgText>
          <SvgText x={BX} y={390} size={22}>Parent B</SvgText>
          <SvgText x={BX} y={500} size={22}>Child</SvgText>
          <Row y={310} kind="A" show={step === 1} />
          <Row y={400} kind="B" show={step === 1} />
          {pattern.map((p, i) => (
            <line key={i} x1={BX + i * BP + BW / 2} x2={BX + i * BP + BW / 2} y1={(p === 'A' ? 350 : 440)} y2={510} stroke={p === 'A' ? 'var(--cobalt)' : 'var(--violet)'} strokeWidth={2} opacity={0.5} />
          ))}
          <Row y={510} kind="child" show={step === 1} delay={0.5} />
          <SvgText x={BX} y={610} size={28} fill="var(--ink-2)">A child inherits whole routes from either parent.</SvgText>
        </RevealG>
        {step >= 2 && (
          <ChartPanel x={1030} y={230} w={780} h={440} title="Mutation rate" yDomain={[0, 50]} yTicks={[0, 25, 50]} xDomain={[0, 200]} xTicks={[0, 100, 200]} fmtY={(v) => `${v}%`} show>
            {(sx, sy, box) => (
              <>
                <ChartLine values={mutation} sx={sx} sy={sy} box={box} color="var(--cobalt)" show />
                <RevealG show delay={1.2}>
                  <text x={sx(0) + 14} y={sy(mutation[0]) - 16} fontSize={30} fontWeight={700} fill="var(--cobalt)">{claim('mut.start')}</text>
                  <text x={sx(199)} y={sy(mutation[199]) + 44} fontSize={30} fontWeight={700} fill="var(--cobalt)" textAnchor="end">{claim('mut.end')}</text>
                  <text x={box.x + box.w / 2} y={box.y + box.h - 24} fontSize={26} fill="var(--ink-2)" textAnchor="middle">Explore early, refine late.</text>
                </RevealG>
              </>
            )}
          </ChartPanel>
        )}
      </svg>
      <Reveal show style={abs(120, 1000, { ...T.label, fontSize: 22, fontWeight: 400, color: 'var(--muted)', width: 1680 })}>
        {`Genetic algorithms: ${cite('holland1992', 'goldberg1989')}. Applied to liner network design by ${cite('cariou2018')}`}
      </Reveal>
      {cfg.map(([k, v], i) => (
        <Reveal key={k} show={step >= 3} delay={i * 0.06} style={abs(120 + (i % 4) * 430, 790 + Math.floor(i / 4) * 110, { width: 400 })}>
          <div style={{ ...T.label, fontSize: 22, fontWeight: 400, color: 'var(--muted)' }}>{k}</div>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em' }}>{v}</div>
        </Reveal>
      ))}
    </div>
  )
}
