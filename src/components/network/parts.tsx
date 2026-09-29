import { motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { dur, easeInOut, ease, useDur, useEnv } from '../../engine/motion'
import type { Pt } from '../../engine/geom'
import { tierStyle, type Tier } from './tiers'

/** A route that draws along its direction. Dashed/dotted styles are revealed through a drawing mask. */
export function DrawLink({ d, tier, show, delay = 0, opacity = 1, startShown = false, drawTime = dur.draw, strokeWidth }: {
  d: string
  tier: Tier
  show: boolean
  delay?: number
  opacity?: number
  startShown?: boolean
  drawTime?: number
  strokeWidth?: number
}) {
  const id = useId().replace(/:/g, '')
  const dd = useDur()
  const { mode } = useEnv()
  const st = tierStyle[tier]
  const w = strokeWidth ?? st.w
  // Print/PDF: no masks (some PDF viewers ignore soft masks and would reveal hidden routes).
  if (mode === 'print') {
    return show ? (
      <path d={d} fill="none" stroke={st.color} strokeWidth={w} strokeDasharray={st.dash} strokeLinecap={tier === 'loop' ? 'round' : 'butt'} opacity={opacity} />
    ) : null
  }
  const t = { duration: dd(show ? drawTime : 0.25), delay: dd(show ? delay : 0), ease: easeInOut }
  return (
    <g>
      <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
        <motion.path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={w + 10}
          strokeLinecap="butt"
          initial={{ pathLength: startShown ? 1 : 0 }}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={t}
        />
      </mask>
      <motion.path
        d={d}
        fill="none"
        stroke={st.color}
        strokeWidth={w}
        strokeDasharray={st.dash}
        strokeLinecap={tier === 'loop' ? 'round' : 'butt'}
        mask={`url(#${id})`}
        initial={{ opacity: startShown ? opacity : 1 }}
        animate={{ opacity }}
        transition={{ duration: dd(0.45), ease }}
      />
    </g>
  )
}

/** A port. Scales in; hubs are larger with a cobalt ring. */
export function Port({ p, r = 9, hub = false, show, delay = 0, opacity = 1, startShown = false }: {
  p: Pt; r?: number; hub?: boolean; show: boolean; delay?: number; opacity?: number; startShown?: boolean
}) {
  const d = useDur()
  const { mode } = useEnv()
  if (mode === 'print' && !show) return null
  return (
    <motion.g
      style={{ x: p.x, y: p.y }}
      initial={{ opacity: startShown ? opacity : 0, scale: startShown ? 1 : 0.6 }}
      animate={{ opacity: show ? opacity : 0, scale: show ? 1 : 0.6 }}
      transition={{ duration: d(0.45), delay: d(show ? delay : 0), ease }}
    >
      {hub ? (
        <>
          <circle r={r} fill="var(--bg)" stroke="var(--cobalt)" strokeWidth={5} />
          <circle r={r - 9} fill="var(--cobalt)" />
        </>
      ) : (
        <circle r={r} fill="var(--ink)" />
      )}
    </motion.g>
  )
}

export function SvgText({ x, y, children, size = 24, fill = 'var(--muted)', weight = 500, anchor = 'start', show = true, opacity = 1, delay = 0 }: {
  x: number; y: number; children: ReactNode; size?: number; fill?: string; weight?: number
  anchor?: 'start' | 'middle' | 'end'; show?: boolean; opacity?: number; delay?: number
}) {
  const d = useDur()
  const { mode } = useEnv()
  if (mode === 'print' && !show) return null
  return (
    <motion.text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? opacity : 0 }}
      transition={{ duration: d(0.4), delay: d(show ? delay : 0) }}
    >
      {children}
    </motion.text>
  )
}
