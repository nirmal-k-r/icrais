import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { SceneProps } from '../content/scenes'
import { claim } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink, Port, SvgText } from '../components/network/parts'
import { Mover } from '../components/network/Mover'
import { Ship } from '../components/network/glyphs'
import { tierStyle } from '../components/network/tiers'
import { link, makeRoute, quadD, type Pt, type Quad } from '../engine/geom'
import land from '../data/land-110m.json'
import solution from '../data/solution.json'
import { T, abs } from '../styles/type'

const projection = geoNaturalEarth1().fitExtent([[276, 250], [1644, 930]], { type: 'Sphere' })
const toPath = geoPath(projection)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const landPath = toPath(feature(land as any, (land as any).objects.land) as any)!
const sphere = toPath({ type: 'Sphere' })!
const byCode = Object.fromEntries(solution.ports.map((p) => [p.code, p]))
const xy = (code: string): Pt => {
  const [x, y] = projection([byCode[code].lon, byCode[code].lat])!
  return { x, y }
}
/** a curve that bulges "up" on screen, like the arcs of a flow map (great circles would detour over the Arctic) */
const curve = (a: Pt, b: Pt): Quad => {
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  return link(a, b, Math.min(0.2 * len, 130) * (b.x >= a.x ? 1 : -1))
}
const wrapWidth = (lat: number) => projection([180, lat])![0] - projection([-180, lat])![0]
/** one or two SVG paths for a lane: a Pacific crossing leaves one map edge and re-enters at the other */
function lanePaths(a: string, b: string): string[] {
  const A = byCode[a], B = byCode[b]
  const pa = xy(a), pb = xy(b)
  if (Math.abs(A.lon - B.lon) <= 180) return [quadD(curve(pa, pb))]
  const o = wrapWidth((A.lat + B.lat) / 2)
  const west = A.lon < B.lon ? 1 : -1
  return [quadD(curve(pa, { x: pb.x - west * o, y: pb.y })), quadD(curve(pb, { x: pa.x + west * o, y: pa.y }))]
}

const lanes = solution.lanes.map((l) => ({ ...l, ds: lanePaths(l.a, l.b) }))
type Type = 'direct' | 'trunk' | 'feeder'
const byType = (t: Type) => lanes.filter((l) => l.type === t)
const types: { t: Type; claim: string; label: string; x: number; step: number }[] = [
  { t: 'direct', claim: 'sol.direct', label: 'Direct', x: 120, step: 1 },
  { t: 'trunk', claim: 'sol.trunk', label: 'Trunk', x: 480, step: 2 },
  { t: 'feeder', claim: 'sol.feeder', label: 'Feeder', x: 820, step: 3 },
]

// the real 10-port service (23 vessels): its legs, closed into a loop
const loopCodes = solution.loop.ports
const loopQuads = loopCodes.map((c, i) => curve(xy(c), xy(loopCodes[(i + 1) % loopCodes.length])))
const loopRoute = makeRoute(loopQuads)
const cityLabel: Record<string, { dx: number; dy: number; a: 'start' | 'end'; name: string }> = {
  AEJEA: { dx: -14, dy: -14, a: 'end', name: 'Jebel Ali' },
  THLCH: { dx: 12, dy: 38, a: 'start', name: 'Laem Chabang' },
  HKHKG: { dx: 16, dy: 12, a: 'start', name: 'Hong Kong' },
  CNSHA: { dx: 16, dy: -12, a: 'start', name: 'Shanghai' },
  NLRTM: { dx: -16, dy: -16, a: 'end', name: 'Rotterdam' },
  ESALG: { dx: -14, dy: 30, a: 'end', name: 'Algeciras' },
}

export function S16bNetwork({ step }: SceneProps) {
  const focus = step >= 4
  const dim = focus ? 0.24 : 1
  const inLoop = new Set(loopCodes)
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 80, { ...T.h1s })}>A WorldLarge solution</Reveal>
      <Reveal show delay={0.2} style={abs(120, 162, { width: 1680 })}>
        <div style={{ ...T.body, fontSize: 28, color: 'var(--ink-2)' }}>
          {claim('sol.services')} services across {claim('sol.ports')} ports, in three types with different roles.
        </div>
      </Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <RevealG show dur={0.8}><path d={landPath} fill="var(--hair)" /></RevealG>
        <defs><clipPath id="sphereClip"><path d={sphere} /></clipPath></defs>
        <g clipPath="url(#sphereClip)">
          {(['direct', 'trunk', 'feeder'] as Type[]).flatMap((t) => {
            const st = types.find((x) => x.t === t)!.step
            // the type being introduced is at full strength; earlier types step back; the spotlight dims everything
            const strength = focus ? dim : step === st || step === 0 ? 1 : step > st ? 0.3 : 1
            return byType(t).flatMap((l, i) => l.ds.map((d, k) => (
              <DrawLink key={t + l.a + l.b + k} d={d} tier={t} show={step >= st} delay={Math.min(i * 0.02, 1.2)} strokeWidth={l.width} opacity={strength * 0.95} drawTime={0.8} />
            )))
          })}
        </g>
        {solution.ports.map((p, i) => (
          <Port key={p.code} p={xy(p.code)} r={p.hub ? 11 : 4} hub={p.hub} show delay={0.2 + Math.min(i * 0.004, 0.6)} opacity={p.served ? (!focus || inLoop.has(p.code) ? 1 : dim) : 0.35} />
        ))}
        {/* the real rotation (step 3) */}
        {loopQuads.map((q, i) => <DrawLink key={i} d={quadD(q)} tier="direct" show={focus} delay={i * 0.25} strokeWidth={5} drawTime={0.6} />)}
        {loopCodes.filter((c) => cityLabel[c]).map((c) => {
          const pt = xy(c), l = cityLabel[c]
          return <SvgText key={c} x={pt.x + l.dx} y={pt.y + l.dy} anchor={l.a} size={22} weight={700} fill="var(--ink)" show={focus} delay={0.4}>{l.name}</SvgText>
        })}
        <Mover route={loopRoute} progress={focus ? 1 : 0} duration={7} delay={2} visible={focus} upright>
          <Ship scale={0.8} />
        </Mover>
        {/* legend: one entry per service type, appearing with its layer */}
        {types.map((x) => (
          <RevealG key={x.t} show={step >= x.step}>
            <line x1={x.x} x2={x.x + 70} y1={992} y2={992} stroke={tierStyle[x.t].color} strokeWidth={tierStyle[x.t].w + 1} strokeDasharray={tierStyle[x.t].dash} />
            <text x={x.x + 86} y={1000} fontSize={24} fontWeight={600} fill="var(--ink)">{x.label} ({claim(x.claim)})</text>
          </RevealG>
        ))}
        <RevealG show={step >= 1}><text x={1200} y={1000} fontSize={22} fill="var(--muted)">Line width shows weekly load</text></RevealG>
      </svg>
      <Reveal show={focus} delay={0.6} style={abs(120, 946, { width: 1680, ...T.label, fontSize: 26, fontWeight: 500, color: 'var(--ink-2)' })}>
        One real trunk service: a {claim('sol.loopPorts')}-port loop between Asia and Europe, run by {claim('sol.loopVessels')} vessels.
      </Reveal>
    </div>
  )
}
