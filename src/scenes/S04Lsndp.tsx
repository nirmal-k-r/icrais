import type { SceneProps } from '../content/scenes'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink, Port } from '../components/network/parts'
import { Mover } from '../components/network/Mover'
import { Container, Ship } from '../components/network/glyphs'
import { chainD, link, makeRoute, type Pt } from '../engine/geom'
import { T, abs } from '../styles/type'

const P: Pt[] = [
  { x: 900, y: 300 }, { x: 1300, y: 260 }, { x: 1700, y: 340 },
  { x: 1050, y: 540 }, { x: 1450, y: 560 }, { x: 1720, y: 660 },
  { x: 820, y: 780 }, { x: 1220, y: 820 },
]
const loopLegs = (idx: number[], bend: number) => idx.map((p, i) => link(P[p], P[idx[(i + 1) % idx.length]], bend))
const svcA = loopLegs([0, 1, 4, 3], 36) // trunk-style service
const svcB = loopLegs([1, 2, 5, 4], -36) // feeder-style service (shares ports 1 and 4 with A)
const svcC = loopLegs([3, 6, 7, 4], 36) // regional loop (shares ports 3 and 4)
const routeA = makeRoute(svcA)
const routeB = makeRoute(svcB)
const routeC = makeRoute(svcC)
// one container: rides A to the shared port, then switches to B
const cargoRoute = makeRoute([svcA[0], svcA[1], svcB[3]])

const words = [
  { k: 'Routes', d: 'Port sequence of every service' },
  { k: 'Fleet', d: 'Which vessel sails which route' },
  { k: 'Cargo', d: 'Which services carry each shipment' },
]

export function S04Lsndp({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>The liner shipping network design problem</Reveal>
      <div style={abs(120, 260, { width: 560 })}>
        {words.map((w, i) => (
          <Reveal key={w.k} show={step >= (i === 0 ? 1 : 2)} delay={i * 0.1} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em' }}>{w.k}</div>
            <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)' }}>{w.d}</div>
          </Reveal>
        ))}
      </div>
      <Reveal show={step >= 3} style={abs(120, 640, { width: 560 })}>
        <div style={{ fontSize: 40, fontWeight: 600, color: 'var(--cobalt)' }}>Maximise profit</div>
        <div style={{ fontSize: 40, fontWeight: 600, color: 'var(--violet)', marginTop: 6 }}>Deliver weekly demand</div>
        <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)', marginTop: 18 }}>
          Coupled decisions: assigning one vessel changes capacity everywhere else.
        </div>
      </Reveal>
      <Reveal show={step >= 4} style={abs(120, 930, { ...T.label, color: 'var(--ink-2)' })}>NP-hard problem studied for decades</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <DrawLink d={chainD(svcC)} tier="loop" show={step >= 1} delay={0.5} strokeWidth={5} />
        <DrawLink d={chainD(svcB)} tier="feeder" show={step >= 1} delay={0.25} />
        <DrawLink d={chainD(svcA)} tier="trunk" show={step >= 1} />
        {P.map((p, i) => <Port key={i} p={p} r={11} show delay={i * 0.05} />)}
        <RevealG show={step >= 2}>
          <Mover route={routeA} progress={step >= 2 ? 1 : 0} duration={2.6}><Ship scale={0.9} /></Mover>
          <Mover route={routeB} progress={step >= 2 ? 1 : 0} duration={2.6} delay={0.3}><Ship scale={0.9} /></Mover>
          <Mover route={routeC} progress={step >= 2 ? 1 : 0} duration={2.6} delay={0.6}><Ship scale={0.9} /></Mover>
        </RevealG>
        <Mover route={cargoRoute} progress={step >= 2 ? 1 : 0} duration={3.4} delay={0.4} visible={step >= 2} rotate={false}>
          <Container w={30} h={20} />
        </Mover>
      </svg>
    </div>
  )
}
