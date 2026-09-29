import type { SceneProps } from '../content/scenes'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink, SvgText } from '../components/network/parts'
import { Mover } from '../components/network/Mover'
import { Container } from '../components/network/glyphs'
import { ALL_LAYERS, TiersNetwork } from '../components/network/TiersNetwork'
import { directAlt, journeyDest, journeyLegs, journeyOrigin, journeyRoute } from '../components/network/tiersLayout'
import { quadAt, quadD } from '../engine/geom'
import { T, abs } from '../styles/type'

const legLabel = [
  { text: 'Feeder', color: 'var(--violet)', dx: -26, dy: 6, anchor: 'end' as const },
  { text: 'Trunk', color: 'var(--cobalt)', dx: 0, dy: 44, anchor: 'middle' as const },
  { text: 'Feeder', color: 'var(--violet)', dx: -16, dy: 50, anchor: 'end' as const },
]
const progress = [0, journeyRoute.legEnds[0], journeyRoute.legEnds[1], 1]
const legDur = [0.9, 0.9, 1.2, 0.9]

export function S10Journey({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show y={0} style={abs(120, 96, { ...T.h1s })}>One cargo journey, several services</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <TiersNetwork layers={ALL_LAYERS} journey startShown />
        <SvgText x={journeyOrigin.x - 24} y={journeyOrigin.y + 8} anchor="end" size={26} weight={600} fill="var(--ink)" show>Origin</SvgText>
        <SvgText x={journeyDest.x + 26} y={journeyDest.y + 8} anchor="start" size={26} weight={600} fill="var(--ink)" show>Destination</SvgText>
        {journeyLegs.map((q, i) => {
          const m = quadAt(q, 0.5)
          const l = legLabel[i]
          return <SvgText key={i} x={m.x + l.dx} y={m.y + l.dy} anchor={l.anchor} size={24} weight={700} fill={l.color} show={step >= i + 1}>{l.text}</SvgText>
        })}
        <DrawLink d={quadD(directAlt)} tier="direct" show={step >= 3} delay={0.5} opacity={0.5} />
        <Mover route={journeyRoute} progress={progress[step]} duration={legDur[step]} visible={step >= 1} rotate={false}>
          <Container w={34} h={22} />
        </Mover>
        <RevealG show={step >= 3} delay={1.2}>
          <text x={120} y={960} fontSize={30} fill="var(--ink-2)">Or direct, when capacity exists.</text>
        </RevealG>
      </svg>
    </div>
  )
}
