import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink, Port, SvgText } from '../components/network/parts'
import { Mover } from '../components/network/Mover'
import { Container, Ship } from '../components/network/glyphs'
import { chainD, link, makeRoute, type Pt } from '../engine/geom'
import { easeInOut, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const hubA: Pt = { x: 400, y: 700 }
const hubB: Pt = { x: 1420, y: 700 }
const smallPort: Pt = { x: 910, y: 860 }
const arc = link(hubA, hubB, 190)
const feeder = link(hubA, smallPort, 30)
const shipRoute = makeRoute([feeder])
const cargoRoute = makeRoute([link(smallPort, hubA, -30), arc])
const slots = [0, 1, 2].flatMap((c) => [0, 1].map((r) => ({ dx: (c - 1) * 38, dy: (r - 0.5) * 28 })))

export function S25Close({ step }: SceneProps) {
  const d = useDur()
  const q = step >= 1
  const a = step >= 2
  const out = false
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <motion.div initial={false} animate={{ scale: q ? 0.4667 : 1, y: q ? -112 : 0, opacity: a ? 0 : out ? 0 : q ? 0.6 : 1 }}
        transition={{ duration: d(0.9), ease: easeInOut }} style={abs(120, 210, { width: 1700, transformOrigin: '0 0', ...T.statement })}>
        Is a shipping network well optimised if it <span style={{ color: 'var(--cobalt)' }}>earns profit</span> but <span style={{ color: 'var(--violet)' }}>delivers little cargo</span>?
      </motion.div>
      <motion.div initial={false} animate={{ scale: a ? 0.4667 : 1, y: a ? -390 : 0, opacity: q && !out ? 1 : 0 }}
        transition={{ duration: d(0.9), ease: easeInOut }} style={abs(120, 470, { width: 1700, transformOrigin: '0 0', ...T.statement })}>
        <b>No.</b> It has to <span style={{ color: 'var(--cobalt)' }}>earn</span> <i style={{ fontStyle: 'normal', color: 'var(--muted)' }}>and</i> <span style={{ color: 'var(--violet)' }}>deliver</span>.
      </motion.div>

      <motion.svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }} initial={false} animate={{ opacity: out ? 0 : 1 }} transition={{ duration: d(0.6) }}>
        <Port p={hubA} r={26} hub show={a} />
        <Port p={hubB} r={26} hub show={a} delay={0.1} />
        <DrawLink d={chainD([arc])} tier="trunk" show={a} delay={0.3} />
        <Port p={smallPort} r={13} show={a} delay={0.5} />
        <SvgText x={smallPort.x} y={smallPort.y + 56} anchor="middle" show={a} delay={0.7}>The smaller port</SvgText>
        <DrawLink d={chainD([feeder])} tier="feeder" show={a} delay={0.9} />
        <RevealG show={a} delay={1.6}>
          <Mover route={shipRoute} progress={a ? 1 : 0} duration={1.6} delay={1.7}><Ship scale={1.3} /></Mover>
        </RevealG>
        {slots.map((s, i) => (
          <Mover key={i} route={cargoRoute} progress={a ? 1 : 0} duration={3.4} delay={3.6 + i * 0.12} rotate={false} visible={a}>
            <g transform={`translate(${s.dx} ${s.dy})`}><Container w={32} h={22} /></g>
          </Mover>
        ))}
      </motion.svg>
      <Reveal show={a && !out} delay={4.2} style={abs(120, 950, { ...T.body, fontSize: 34 })}>
        {claim('paper.delivery')} delivered with {claim('paper.profit')} profit on WorldSmall
      </Reveal>

    </div>
  )
}
