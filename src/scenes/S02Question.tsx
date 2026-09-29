import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink, Port, SvgText } from '../components/network/parts'
import { Mover } from '../components/network/Mover'
import { Ship } from '../components/network/glyphs'
import { chainD, link, makeRoute, type Pt } from '../engine/geom'
import { easeInOut, ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const hubA: Pt = { x: 400, y: 660 }
const hubB: Pt = { x: 1420, y: 660 }
const smallPort: Pt = { x: 910, y: 820 }
const arc = link(hubA, hubB, 190)
const route = makeRoute([arc])
const arcMid = { x: 910, y: 660 - 95 }

export function S02Question({ step }: SceneProps) {
  const d = useDur()
  const shrunk = step >= 3
  const line = (show: boolean, delay = 0) => ({ show, delay })
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* the question: large statement that condenses to the top-left */}
      <motion.div
        initial={false}
        animate={{ scale: shrunk ? 0.4667 : 1, y: shrunk ? -112 : 0 }}
        transition={{ duration: d(0.9), ease: easeInOut }}
        style={abs(120, 210, { width: 1700, transformOrigin: '0 0', ...T.statement })}
      >
        <Reveal show>Is a shipping network well optimised if it</Reveal>
        <Reveal {...line(step >= 1)} style={{ color: 'var(--cobalt)' }}>earns profit</Reveal>
        <Reveal {...line(step >= 2)} style={{ color: 'var(--violet)' }}>but delivers little cargo?</Reveal>
      </motion.div>

      {/* illustrative vignette */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Port p={hubA} r={26} hub show={shrunk} />
        <Port p={hubB} r={26} hub show={shrunk} delay={0.1} />
        <SvgText x={hubA.x} y={hubA.y + 66} anchor="middle" show={shrunk} delay={0.3}>Major hub</SvgText>
        <SvgText x={hubB.x} y={hubB.y + 66} anchor="middle" show={shrunk} delay={0.4}>Major hub</SvgText>
        <DrawLink d={chainD([arc])} tier="trunk" show={shrunk} delay={0.6} />
        <RevealG show={shrunk} delay={0.5}>
          <Mover route={route} progress={shrunk ? 0.9 : 0} duration={2.2} delay={1.4}>
            <Ship scale={1.5} />
          </Mover>
        </RevealG>
        <SvgText x={arcMid.x} y={arcMid.y - 46} anchor="middle" size={56} weight={600} fill="var(--cobalt)" show={shrunk} delay={3.5}>$</SvgText>
        {/* the smaller port: cargo waits, nothing moves */}
        <Port p={smallPort} r={13} show={shrunk} delay={0.8} />
        {[0, 1, 2].flatMap((c) =>
          [0, 1].map((r) => (
            <RevealG key={`${c}${r}`} show={shrunk} delay={1 + (c * 2 + r) * 0.07}>
              <rect x={smallPort.x + 36 + c * 42} y={smallPort.y - 26 + r * 30} width={34} height={22} rx={2.5} fill="var(--violet)" />
            </RevealG>
          )),
        )}
        <SvgText x={smallPort.x} y={smallPort.y + 56} anchor="middle" show={shrunk} delay={1.2}>Smaller port, e.g. Port Louis</SvgText>
      </svg>

    </div>
  )
}
void ease
