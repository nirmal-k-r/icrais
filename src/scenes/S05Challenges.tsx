import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { claim } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink } from '../components/network/parts'
import { T, abs } from '../styles/type'

const cw = 480
const ch = 240
const cols = [
  { n: '01', k: 'Scalability', d: 'Performance degrades badly as ports and demand grow.', x: 120, c: cite('christiansen2020') },
  { n: '02', k: 'Efficiency', d: 'Computation time grows exponentially with network size.', x: 720, c: cite('plum2014') },
  { n: '03', k: 'Effectiveness', d: 'Profit-driven search can leave most demand undelivered.', x: 1320, c: cite('cheaitou2020') },
]
const path = (f: (u: number) => number) =>
  Array.from({ length: 41 }, (_, i) => `${i ? 'L' : 'M'}${((i / 40) * cw).toFixed(1)} ${(ch - f(i / 40) * ch).toFixed(1)}`).join(' ')
const rise = (u: number) => (Math.exp(4.2 * u) - 1) / (Math.exp(4.2) - 1)
const fall = (u: number) => 0.06 + 0.94 * (1 - rise(u * 0.92 + 0.04) * 0.98)
const markU = 0.7

function Axes({ x, y, label, yl }: { x: string; y: string; label?: string; yl?: string }) {
  void label; void yl
  return (
    <>
      <line x1={0} y1={ch} x2={cw} y2={ch} stroke="var(--hair)" strokeWidth={2} />
      <line x1={0} y1={0} x2={0} y2={ch} stroke="var(--hair)" strokeWidth={2} />
      <text x={cw} y={ch + 34} fontSize={22} fill="var(--muted)" textAnchor="end">{x}</text>
      <text x={0} y={-14} fontSize={22} fill="var(--muted)">{y}</text>
    </>
  )
}

export function S05Challenges({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>Why existing methods struggle</Reveal>
      {cols.map((c, i) => (
        <Reveal key={c.k} show={step >= i} style={abs(c.x, 250, { width: 500 })}>
          <div className="mono" style={{ ...T.label, color: 'var(--muted)' }}>{c.n}</div>
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-0.03em', margin: '10px 0 14px' }}>{c.k}</div>
          <div style={{ ...T.body, fontSize: 30, color: 'var(--ink-2)' }}>{c.d}</div>
          <div style={{ ...T.label, fontSize: 22, fontWeight: 400, color: 'var(--muted)', marginTop: 10 }}>{c.c}</div>
        </Reveal>
      ))}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 01 scalability: solution quality falls as the network grows */}
        <g transform="translate(120 590)">
          <RevealG show={step >= 0} delay={0.3}><Axes x="network size →" y="performance ↑" /></RevealG>
          <DrawLink d={path(fall)} tier="direct" show={step >= 0} delay={0.5} strokeWidth={5} />
        </g>
        {/* 02 efficiency: time explodes; the paper's 19-port exact-method figure is marked */}
        <g transform="translate(720 590)">
          <RevealG show={step >= 1} delay={0.3}><Axes x="ports →" y="computation time ↑" /></RevealG>
          <DrawLink d={path(rise)} tier="direct" show={step >= 1} delay={0.5} strokeWidth={5} />
          <RevealG show={step >= 1} delay={1.3}>
            <circle cx={markU * cw} cy={ch - rise(markU) * ch} r={10} fill="var(--cobalt)" />
            <text x={markU * cw - 18} y={ch - rise(markU) * ch - 8} fontSize={26} fontWeight={700} fill="var(--cobalt)" textAnchor="end">
              {claim('paper.mipPorts')}: {claim('paper.mipTime')}
            </text>
          </RevealG>
        </g>
        {/* 03 effectiveness: profit chased, cargo left behind */}
        <g transform="translate(1320 590)">
          <RevealG show={step >= 2} delay={0.3}>
            <line x1={0} y1={ch} x2={cw} y2={ch} stroke="var(--hair)" strokeWidth={2} />
            <text x={0} y={70} fontSize={24} fontWeight={600} fill="var(--cobalt)">Profit</text>
            <text x={0} y={175} fontSize={24} fontWeight={600} fill="var(--violet)">Cargo delivered</text>
          </RevealG>
          <RevealG show={step >= 2} delay={0.5}>
            <rect x={0} y={84} width={cw * 0.92} height={34} fill="var(--cobalt)" />
            <rect x={0} y={189} width={cw * 0.2} height={34} fill="var(--violet)" />
          </RevealG>
        </g>
      </svg>
    </div>
  )
}
