import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim, num } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const R = ['Europe', 'Asia', 'Americas'] as const
const label: Record<(typeof R)[number], string> = { Europe: 'Europe', Asia: 'Asia', Americas: 'Americas & others' }
const CX = 420, CY = 340, CW = 226, CH = 130

export function S20Regions({ step }: SceneProps) {
  const d = useDur()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>Delivery across regions</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <text x={CX} y={CY - 70} fontSize={22} fill="var(--muted)">Rows show the origin region and columns the destination region</text>
        {R.map((c, j) => <text key={c} x={CX + j * (CW + 8) + CW / 2} y={CY - 18} fontSize={24} fontWeight={600} fill="var(--ink)" textAnchor="middle">{label[c]}</text>)}
        {R.map((r, i) => (
          <g key={r}>
            <text x={CX - 20} y={CY + i * (CH + 8) + CH / 2 + 8} fontSize={24} fontWeight={600} fill="var(--ink)" textAnchor="end">{label[r]}</text>
            {R.map((c, j) => {
              const id = `run.region.${r}.${c}`
              const v = num(id)
              const a = 0.15 + ((v - 90) / 10) * 0.85
              const x = CX + j * (CW + 8)
              const y = CY + i * (CH + 8)
              return (
                <g key={c}>
                  <motion.rect x={x} y={y} width={CW} height={CH} rx={6} fill="var(--violet)" initial={{ opacity: 0 }} animate={{ opacity: a }} transition={{ duration: d(0.5), delay: d((i * 3 + j) * 0.06) }} />
                  <RevealG show delay={(i * 3 + j) * 0.06 + 0.2}>
                    <text x={x + CW / 2} y={y + CH / 2 + 14} fontSize={40} fontWeight={700} textAnchor="middle" fill={a > 0.55 ? 'var(--bg)' : 'var(--ink)'}>{claim(id)}</text>
                  </RevealG>
                </g>
              )
            })}
          </g>
        ))}
        <RevealG show={step >= 1}>
          <rect x={CX} y={CY} width={CW} height={CH} rx={6} fill="none" stroke="var(--ink)" strokeWidth={5} />
          <rect x={CX + 2 * (CW + 8)} y={CY + 2 * (CH + 8)} width={CW} height={CH} rx={6} fill="none" stroke="var(--ink)" strokeWidth={5} strokeDasharray="10 8" />
        </RevealG>
      </svg>
      <Reveal show={step >= 1} delay={0.3} style={abs(CX, 830, { ...T.h2, fontSize: 40 })}>{claim('paper.regionsAbove90')}</Reveal>
      <Reveal show={step >= 2} style={abs(1320, 340, { width: 480 })}>
        <div style={{ display: 'flex', height: 70 }}>
          <div style={{ width: `${num('paper.transhipShare')}%`, background: 'var(--violet)' }} />
          <div style={{ width: `${num('paper.directShare')}%`, background: 'var(--ink)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, ...T.label }}>
          <span style={{ color: 'var(--violet)' }}>{claim('paper.transhipShare')} transhipped</span>
          <span>{claim('paper.directShare')} direct</span>
        </div>
        <div style={{ ...T.body, fontSize: 28, color: 'var(--ink-2)', marginTop: 28 }}>
          Most cargo reaches its destination through hubs, as the tiers intend.
        </div>
      </Reveal>

    </div>
  )
}
