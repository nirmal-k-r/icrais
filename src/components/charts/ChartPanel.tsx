import { line } from 'd3-shape'
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { easeInOut, dur, useDur, useEnv } from '../../engine/motion'
import { SvgText } from '../network/parts'

export interface Box {
  x: number
  y: number
  w: number
  h: number
}
type Scale = ScaleLinear<number, number>

export function ChartPanel({ x, y, w = 780, h = 380, marginRight = 24, title, subtitle, showSubtitle = false, xDomain, yDomain, xTicks, yTicks, fmtX = String, fmtY = String, show, children }: {
  x: number; y: number; w?: number; h?: number; marginRight?: number
  title: string; subtitle?: string; showSubtitle?: boolean
  xDomain: [number, number]; yDomain: [number, number]
  xTicks: number[]; yTicks: number[]
  fmtX?: (v: number) => string; fmtY?: (v: number) => string
  show: boolean
  children: (sx: Scale, sy: Scale, box: Box) => ReactNode
}) {
  const m = { l: 112, r: marginRight, t: 60, b: 46 }
  const box: Box = { x: m.l, y: m.t, w: w - m.l - m.r, h: h - m.t - m.b }
  const sx = scaleLinear().domain(xDomain).range([box.x, box.x + box.w])
  const sy = scaleLinear().domain(yDomain).range([box.y + box.h, box.y])
  return (
    <g transform={`translate(${x} ${y})`}>
      <SvgText x={0} y={26} size={26} weight={600} fill="var(--ink)" show={show}>{title}</SvgText>
      {subtitle && <SvgText x={w} y={26} size={22} anchor="end" show={showSubtitle}>{subtitle}</SvgText>}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: useDur()(dur.base) }}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={box.x} x2={box.x + box.w} y1={sy(t)} y2={sy(t)} stroke="var(--hair)" strokeWidth={1.5} />
            <text x={box.x - 14} y={sy(t) + 8} fontSize={22} fill="var(--muted)" textAnchor="end">{fmtY(t)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={sx(t)} y={box.y + box.h + 34} fontSize={22} fill="var(--muted)" textAnchor="middle">{fmtX(t)}</text>
        ))}
      </motion.g>
      {show && children(sx, sy, box)}
    </g>
  )
}

/** A data series that reveals left→right through a clip wipe (reading order). */
export function ChartLine({ values, sx, sy, box, color, show, delay = 0, width = 4, dash, opacity = 1 }: {
  values: number[]; sx: Scale; sy: Scale; box: Box; color: string; show: boolean; delay?: number; width?: number; dash?: string; opacity?: number
}) {
  const id = useId().replace(/:/g, '')
  const d = useDur()
  const { mode } = useEnv()
  const path = line<number>().x((_, i) => sx(i)).y((v) => sy(v))(values)!
  if (mode === 'print') {
    return show ? <path d={path} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeDasharray={dash} opacity={opacity} /> : null
  }
  return (
    <motion.g initial={{ opacity }} animate={{ opacity }} transition={{ duration: d(0.4) }}>
      <clipPath id={id}>
        <motion.rect
          x={box.x - 4}
          y={box.y - 12}
          height={box.h + 24}
          initial={{ width: 0 }}
          animate={{ width: show ? box.w + 8 : 0 }}
          transition={{ duration: d(show ? dur.chart : 0.3), delay: d(show ? delay : 0), ease: easeInOut }}
        />
      </clipPath>
      <path d={path} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeDasharray={dash} clipPath={`url(#${id})`} />
    </motion.g>
  )
}
