import type { SceneProps } from '../content/scenes'
import conv from '../data/figrun-convergence.json'
import { claim, num } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { ProvenanceCue } from '../components/ProvenanceCue'
import { SvgText } from '../components/network/parts'
import { ChartLine, ChartPanel } from '../components/charts/ChartPanel'
import { T, abs } from '../styles/type'

const profit = conv.profit.map((v) => v / 1e6)
const fitness = conv.fitness.map((v) => v / 1e6)
const fmtM = (v: number) => `${v < 0 ? '−' : ''}$${Math.abs(v)}M`
const X = { xDomain: [0, 200] as [number, number], xTicks: [0, 50, 100, 150, 200] }
const crossGen = num('run.profitCrossGen')

export function S17Convergence({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 80, { ...T.h1 })}>Convergence over {claim('cfg.generations')} generations</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* profit */}
        <ChartPanel x={120} y={200} title="Profit ($ per week)" yDomain={[-520, 80]} yTicks={[-400, -200, 0]} fmtY={fmtM} show {...X}>
          {(sx, sy, box) => (
            <>
              <line x1={box.x} x2={box.x + box.w} y1={sy(0)} y2={sy(0)} stroke="var(--ink)" strokeWidth={step >= 1 ? 2 : 0} opacity={0.55} />
              <ChartLine values={profit} sx={sx} sy={sy} box={box} color="var(--cobalt)" show={step >= 1} />
              <RevealG show={step >= 1} delay={1.4}>
                <circle cx={sx(crossGen)} cy={sy(0)} r={8} fill="var(--cobalt)" />
                <text x={sx(crossGen) + 16} y={sy(0) + 44} fontSize={22} fill="var(--cobalt)" fontWeight={600}>{claim('run.profitCrossText')}</text>
                <text x={box.x + box.w} y={sy(profit[199]) - 22} fontSize={28} fill="var(--cobalt)" fontWeight={700} textAnchor="end">{claim('run.profit')}</text>
              </RevealG>
            </>
          )}
        </ChartPanel>
        {/* delivery */}
        <ChartPanel x={1020} y={200} title="Demand delivered (%)" yDomain={[0, 105]} yTicks={[0, 50, 100]} fmtY={(v) => `${v}%`} show {...X}>
          {(sx, sy, box) => (
            <>
              <ChartLine values={conv.delivery} sx={sx} sy={sy} box={box} color="var(--violet)" show={step >= 2} />
              <RevealG show={step >= 2} delay={1.4}>
                <line x1={sx(num('run.deliveryStableGen'))} x2={box.x + box.w} y1={sy(90)} y2={sy(90)} stroke="var(--violet)" strokeWidth={2} strokeDasharray="6 6" opacity={0.6} />
                <text x={sx(num('run.deliveryStableGen')) - 10} y={sy(90) + 60} fontSize={22} fill="var(--violet)" fontWeight={600} textAnchor="middle">{claim('run.deliveryStableText')}</text>
                <text x={box.x + box.w} y={sy(conv.delivery[199]) - 24} fontSize={28} fill="var(--violet)" fontWeight={700} textAnchor="end">{claim('run.delivery')}</text>
              </RevealG>
            </>
          )}
        </ChartPanel>
        {/* fitness */}
        <ChartPanel x={120} y={590} title="Fitness score (M)" subtitle="includes the delivery reward, not profit" showSubtitle={step >= 3} yDomain={[-520, 280]} yTicks={[-400, -200, 0, 200]} fmtY={(v) => `${v < 0 ? '−' : ''}${Math.abs(v)}`} show {...X}>
          {(sx, sy, box) => (
            <>
              <ChartLine values={fitness} sx={sx} sy={sy} box={box} color="var(--ink)" show={step >= 3} />
              <RevealG show={step >= 3} delay={1.4}>
                <line x1={sx(crossGen)} x2={sx(crossGen)} y1={box.y} y2={box.y + box.h} stroke="var(--ink)" strokeWidth={2} strokeDasharray="6 6" opacity={0.6} />
                <text x={sx(crossGen) + 14} y={sy(-330)} fontSize={22} fill="var(--ink)" fontWeight={600}>Profit &gt; 0: α rises</text>
                <text x={sx(crossGen) + 14} y={sy(-330) + 28} fontSize={22} fill="var(--ink)" fontWeight={600}>{claim('fit.alphaNeg')} → {claim('fit.alphaPos')}</text>
              </RevealG>
            </>
          )}
        </ChartPanel>
        {/* vessels */}
        <ChartPanel x={1020} y={590} title="Vessels used" yDomain={[30, 245]} yTicks={[50, 100, 150, 200]} show {...X}>
          {(sx, sy, box) => (
            <>
              <line x1={box.x} x2={box.x + box.w} y1={sy(num('cfg.minVessels'))} y2={sy(num('cfg.minVessels'))} stroke="var(--muted)" strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
              <SvgText x={box.x + box.w} y={sy(num('cfg.minVessels')) - 12} anchor="end" size={22} show>min {claim('cfg.minVessels')}</SvgText>
              <ChartLine values={conv.vessels} sx={sx} sy={sy} box={box} color="var(--muted)" show={step >= 4} />
              <RevealG show={step >= 4} delay={1.4}>
                <text x={sx(0) + 16} y={sy(conv.vessels[0]) - 16} fontSize={26} fill="var(--muted)" fontWeight={700}>{claim('run.start.vessels')}</text>
                <text x={box.x + box.w} y={sy(conv.vessels[199]) - 22} fontSize={28} fill="var(--ink)" fontWeight={700} textAnchor="end">{claim('run.vessels')}</text>
              </RevealG>
            </>
          )}
        </ChartPanel>
      </svg>
      <ProvenanceCue kind="figrun" />
    </div>
  )
}
