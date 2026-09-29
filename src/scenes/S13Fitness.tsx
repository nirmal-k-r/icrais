import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import conv from '../data/figrun-convergence.json'
import { claim, num } from '../content/claims'
import { ProvenanceCue } from '../components/ProvenanceCue'
import { Reveal, RevealG } from '../components/Reveal'
import { ChartLine, ChartPanel } from '../components/charts/ChartPanel'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const profit = conv.profit.map((v) => v / 1e6)

function Term({ i, color, children }: { i: number; color?: string; children: React.ReactNode }) {
  const d = useDur()
  return (
    <motion.span
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: d(0.5), delay: d(0.15 + i * 0.14), ease }}
      style={{ display: 'inline-block', color, whiteSpace: 'pre' }}
    >
      {children}
    </motion.span>
  )
}

export function S13Fitness({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>Delivery changes the fitness score</Reveal>
      <div style={abs(120, 230, { fontSize: 76, fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'nowrap' })}>
        <Term i={0}>Fitness</Term>
        <Term i={1} color="var(--muted)">{' = '}</Term>
        <Term i={2} color="var(--cobalt)">Profit</Term>
        <Term i={3} color="var(--muted)">{' + '}</Term>
        <Term i={4}>α</Term>
        <Term i={5} color="var(--muted)">{' × '}</Term>
        <Term i={6} color="var(--violet)">Delivery (%)</Term>
      </div>
      <Reveal show={step >= 1} style={abs(120, 380, { ...T.body, fontSize: 34 })}>
        <div style={{ borderLeft: '3px solid var(--violet)', paddingLeft: 24 }}>
          <div>α = <b>{claim('fit.alphaPos')}</b> per point, if profit &gt; 0</div>
          <div style={{ marginTop: 6 }}>α = <b>{claim('fit.alphaNeg')}</b> per point, otherwise</div>
        </div>
      </Reveal>
      <Reveal show={step >= 2} style={abs(120, 530, { width: 1500 })}>
        <div style={{ ...T.body, fontSize: 34 }}>{claim('fit.delivery90text')}, larger than any profit the search found.</div>
        <div style={{ ...T.body, fontSize: 28, color: 'var(--muted)', marginTop: 10 }}>
          Why: without it, the GA drifted to profitable but sparse networks, with vessels chartered out instead of moving cargo.
        </div>
      </Reveal>
      {step >= 3 && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <ChartPanel x={120} y={660} w={860} h={340} title="Profit over generations" yDomain={[-520, 80]} yTicks={[-400, 0]} xDomain={[0, 200]} xTicks={[0, 100, 200]} fmtY={(v) => `${v < 0 ? '−' : ''}$${Math.abs(v)}M`} show>
            {(sx, sy, box) => (
              <>
                <line x1={box.x} x2={box.x + box.w} y1={sy(0)} y2={sy(0)} stroke="var(--ink)" strokeWidth={2} opacity={0.5} />
                <ChartLine values={profit} sx={sx} sy={sy} box={box} color="var(--cobalt)" show />
                <RevealG show delay={1.2}>
                  <text x={sx(num('run.profitCrossGen') / 2)} y={sy(-250)} fontSize={24} fontWeight={700} fill="var(--muted)" textAnchor="middle">α = {claim('fit.alphaNeg')}</text>
                  <text x={sx(150)} y={sy(-250)} fontSize={24} fontWeight={700} fill="var(--violet)" textAnchor="middle">α = {claim('fit.alphaPos')}</text>
                  <line x1={sx(num('run.profitCrossGen'))} x2={sx(num('run.profitCrossGen'))} y1={box.y} y2={box.y + box.h} stroke="var(--ink)" strokeDasharray="6 6" strokeWidth={2} opacity={0.6} />
                </RevealG>
              </>
            )}
          </ChartPanel>
        </svg>
      )}
      <Reveal show={step >= 3} delay={0.6} style={abs(1080, 760, { width: 700, ...T.h2, fontSize: 40 })}>
        When profit turns positive, every delivered point becomes worth more.
      </Reveal>
      <Reveal show={step >= 4} style={abs(1800 - 700, 950, { width: 700, ...T.label, color: 'var(--muted)', textAlign: 'right' })}>
        A weighted scalar score, not a Pareto front.
      </Reveal>
      <ProvenanceCue kind="figrun" show={step >= 3} />
    </div>
  )
}
