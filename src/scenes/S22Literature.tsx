import type { SceneProps } from '../content/scenes'
import { cite } from '../content/references'
import { claim, num } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { ChartPanel } from '../components/charts/ChartPanel'
import { T, abs } from '../styles/type'

const pts = [
  { name: cite('brouer2013'), p: 'lit.brouer.profit', dl: 'lit.brouer.delivery', at: 0, dx: 20, dy: 38 },
  { name: cite('karsten2017a'), p: 'lit.karsten.profit', dl: 'lit.karsten.delivery', at: 0, dx: -18, dy: -34 },
  { name: cite('koza2020'), p: 'lit.koza.profit', dl: 'lit.koza.delivery', at: 0, dx: 18, dy: 52 },
]

export function S22Literature({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 80, { ...T.h1s })}>Against published WorldSmall results</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <ChartPanel x={120} y={170} w={1240} h={800} title="Profit ($M) against demand delivered (%)" xDomain={[74, 96]} yDomain={[-6, 44]} xTicks={[75, 80, 85, 90, 95]} yTicks={[0, 10, 20, 30, 40]} fmtX={(v) => `${v}%`} fmtY={(v) => `$${v}M`} show>
          {(sx, sy) => (
            <>
              {pts.map((q, i) => {
                const px = sx(num(q.dl)), py = sy(num(q.p))
                return (
                  <RevealG key={q.name} show delay={0.4 + i * 0.35}>
                    <circle cx={px} cy={py} r={13} fill="var(--muted)" />
                    <text x={px + q.dx} y={py + q.dy} fontSize={26} fontWeight={600} fill="var(--ink)" textAnchor={q.dx < 0 ? 'end' : 'start'}>{q.name}</text>
                    <text x={px + q.dx} y={py + q.dy + 28} fontSize={22} fill="var(--muted)" textAnchor={q.dx < 0 ? 'end' : 'start'}>{claim(q.p)} at {claim(q.dl)}</text>
                  </RevealG>
                )
              })}
              <RevealG show={step >= 1} delay={0.2}>
                <circle cx={sx(num('paper.deliveryLit'))} cy={sy(num('paper.profit'))} r={20} fill="var(--cobalt)" />
                <text x={sx(num('paper.deliveryLit')) - 34} y={sy(num('paper.profit')) + 10} fontSize={30} fontWeight={700} fill="var(--cobalt)" textAnchor="end">Multi-Tier GA</text>
                <text x={sx(num('paper.deliveryLit')) - 34} y={sy(num('paper.profit')) + 42} fontSize={24} fill="var(--ink-2)" textAnchor="end">{claim('paper.profit')} at {claim('paper.deliveryLit')}</text>
              </RevealG>
            </>
          )}
        </ChartPanel>
      </svg>
      <Reveal show={step >= 2} style={abs(1420, 420, { width: 380, ...T.body, fontSize: 28, color: 'var(--ink-2)' })}>
        Values are quoted from each study. Their formulations and conditions differ, so read this as context rather than a controlled benchmark.
      </Reveal>
    </div>
  )
}
