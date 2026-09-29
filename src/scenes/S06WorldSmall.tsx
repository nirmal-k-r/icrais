import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { CountUp } from '../components/CountUp'
import { ProvenanceCue } from '../components/ProvenanceCue'
import { Reveal, RevealG } from '../components/Reveal'
import { Port, SvgText } from '../components/network/parts'
import land from '../data/land-110m.json'
import ports from '../data/ports.json'
import { T, abs } from '../styles/type'

const projection = geoNaturalEarth1().fitExtent([[560, 200], [1800, 900]], { type: 'Sphere' })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const landPath = geoPath(projection)(feature(land as any, (land as any).objects.land) as any)!
const pts = ports.map((p) => ({ ...p, xy: projection([p.lon, p.lat])! }))

const hubLabel: Record<string, { dx: number; dy: number; a: 'start' | 'end' | 'middle' }> = {
  HKHKG: { dx: 18, dy: 30, a: 'start' }, SGSIN: { dx: 18, dy: 30, a: 'start' }, CNSHA: { dx: 18, dy: -14, a: 'start' },
  NLRTM: { dx: -20, dy: -16, a: 'end' }, DEBRV: { dx: 20, dy: -18, a: 'start' },
  USLAX: { dx: -22, dy: 8, a: 'end' }, USCHS: { dx: 22, dy: 8, a: 'start' },
}
const stats = [
  { id: 'inst.ports', label: 'ports' },
  { id: 'inst.vessels', label: 'vessels' },
  { id: 'inst.odPairs', label: 'origin–destination pairs' },
  { id: 'inst.demand', label: 'FFE per week' },
]
const region = { Asia: 'solid', Europe: 'double', Americas: 'dashed' } as const

function Ring({ r, region: rg }: { r: number; region: string }) {
  if (rg === 'Europe') return <><circle r={r} fill="none" stroke="var(--muted)" strokeWidth={2} /><circle r={r + 5} fill="none" stroke="var(--muted)" strokeWidth={2} /></>
  return <circle r={r} fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray={rg === 'Americas' ? '4 4' : undefined} />
}

export function S06WorldSmall({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>Why WorldSmall?</Reveal>
      <Reveal show delay={0.2} style={abs(120, 186, { ...T.body, color: 'var(--muted)' })}>A global LINER-LIB instance</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <RevealG show dur={0.8}><path d={landPath} fill="var(--hair)" /></RevealG>
        {[...pts].sort((a, b) => a.xy[0] - b.xy[0]).map((p, i) => (
          <g key={p.code}>
            <Port p={{ x: p.xy[0], y: p.xy[1] }} r={p.isHub && step >= 1 ? 15 : 5} hub={p.isHub && step >= 1} show delay={0.3 + Math.min(i * 0.012, 0.6)} />
            {!p.isHub && (
              <g transform={`translate(${p.xy[0]} ${p.xy[1]})`}><RevealG show delay={0.6}><Ring r={9} region={p.region} /></RevealG></g>
            )}
            {p.isHub && (
              <SvgText x={p.xy[0] + hubLabel[p.code].dx} y={p.xy[1] + hubLabel[p.code].dy} anchor={hubLabel[p.code].a} size={22} weight={700} fill="var(--cobalt)" show={step >= 1} delay={0.3}>
                {p.code.slice(2)}
              </SvgText>
            )}
          </g>
        ))}
        {(['Asia', 'Europe', 'Americas'] as const).map((rg, i) => (
          <g key={rg} transform={`translate(${570 + i * 235} 950)`}>
            <RevealG show delay={0.8}>
              <g transform="translate(0 -8)"><Ring r={10} region={rg} /></g>
              <text x={28} y={0} fontSize={22} fill="var(--muted)">{rg === 'Americas' ? 'Americas & others' : rg}</text>
            </RevealG>
          </g>
        ))}
        <RevealG show={step >= 1}><g transform="translate(1360 950)"><circle cx={0} cy={-8} r={9} fill="var(--bg)" stroke="var(--cobalt)" strokeWidth={4} /><circle cx={0} cy={-8} r={4} fill="var(--cobalt)" /><text x={22} y={0} fontSize={22} fill="var(--muted)">Assigned hub</text></g></RevealG>
      </svg>
      <div style={abs(120, 300)}>
        {stats.map((s, i) => (
          <Reveal key={s.id} show={step >= 2} delay={i * 0.12} style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 88, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 }}>
              <CountUp to={num(s.id)} final={claim(s.id)} show={step >= 2} delay={i * 0.12} fmt={(v) => Math.round(v).toLocaleString('en-US')} />
            </div>
            <div style={{ ...T.label, fontWeight: 400, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
          </Reveal>
        ))}
      </div>
      <ProvenanceCue kind="instance" />
    </div>
  )
}
void region
