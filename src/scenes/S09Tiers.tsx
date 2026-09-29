import type { SceneProps } from '../content/scenes'
import { Reveal, RevealG } from '../components/Reveal'
import { SvgText } from '../components/network/parts'
import { TiersNetwork, type Layers } from '../components/network/TiersNetwork'
import { tierStyle, type Tier } from '../components/network/tiers'
import { T, abs } from '../styles/type'

const legend: { tier: Tier; text: string; x: number; y: number }[] = [
  { tier: 'direct', text: 'highest-demand OD pairs', x: 120, y: 900 },
  { tier: 'trunk', text: 'between regional hubs', x: 900, y: 900 },
  { tier: 'feeder', text: 'secondary ports ↔ hub', x: 120, y: 952 },
  { tier: 'loop', text: 'remaining fleet, local access', x: 900, y: 952 },
]

export function S09Tiers({ step }: SceneProps) {
  const layers: Layers = { ports: step >= 0, direct: step >= 1, trunk: step >= 2, feeder: step >= 3, loop: step >= 4 }
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>Four service tiers</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <TiersNetwork layers={layers} />
        {legend.map((l, i) => {
          const st = tierStyle[l.tier]
          return (
            <RevealG key={l.tier} show={step >= i + 1}>
              <line x1={l.x} x2={l.x + 70} y1={l.y - 8} y2={l.y - 8} stroke={st.color} strokeWidth={st.w} strokeDasharray={st.dash} strokeLinecap={l.tier === 'loop' ? 'round' : 'butt'} />
              <text x={l.x + 92} y={l.y} fontSize={26} fill="var(--muted)">
                <tspan fontWeight={700} fill="var(--ink)">{st.label}</tspan> {l.text}
              </text>
            </RevealG>
          )
        })}
        <SvgText x={1800} y={1012} anchor="end" size={24} show={step >= 4} delay={0.6}>Built in this order, guided by demand</SvgText>
      </svg>
    </div>
  )
}
