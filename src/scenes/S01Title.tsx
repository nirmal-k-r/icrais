import type { CSSProperties } from 'react'
import type { SceneProps } from '../content/scenes'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const em = (on: boolean, color: string): CSSProperties => ({ color: on ? color : 'var(--ink)', transition: 'color .6s ease, opacity .6s ease' })
const dim = (on: boolean): CSSProperties => ({ opacity: on ? 0.28 : 1, transition: 'opacity .6s ease' })

export function S01Title({ step }: SceneProps) {
  const hl = step >= 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.label, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' })}>
        ICRAIS 2026
      </Reveal>
      <Reveal show delay={0.15} y={24} style={abs(120, 290, { ...T.h1, width: 1560 })}>
        <span style={dim(hl)}>A </span>
        <span style={em(hl, 'var(--cobalt)')}>Multi-Tier</span>{' '}
        <span style={em(hl, 'var(--ink)')}>Genetic Algorithm</span>
        <span style={dim(hl)}> for Large-Scale </span>
        <span style={em(hl, 'var(--violet)')}>Liner Shipping Network Design</span>
      </Reveal>
      <Reveal show delay={0.7} style={abs(120, 640, { width: 1400 })}>
        <div style={{ ...T.label, fontSize: 22, fontWeight: 400, color: 'var(--muted)' }}>Presented by</div>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>Nirmal Rampersand</div>
      </Reveal>
      <Reveal show delay={0.85} style={abs(120, 770, { width: 1500 })}>
        <div style={{ ...T.label, fontSize: 22, fontWeight: 400, color: 'var(--muted)' }}>Authors</div>
        <div style={{ ...T.body, fontSize: 32 }}>Nirmal Rampersand and Oomesh Gukhool (University of Mauritius)</div>
      </Reveal>
      <Reveal show delay={1.0} style={abs(120, 900, { ...T.body, fontSize: 30, color: 'var(--muted)' })}>
        October 2026
      </Reveal>
    </div>
  )
}
