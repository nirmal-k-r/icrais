import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import type { Route } from '../../engine/geom'
import { easeInOut, useDur, useEnv } from '../../engine/motion'

/**
 * Moves its children along a route. `progress` (0..1 by arc length) is the *target* state for the
 * current step; the motion value tweens toward it, so reversing simply tweens back.
 * Cargo therefore only ever travels on an existing link.
 */
export function Mover({ route, progress, duration = 0.9, delay = 0, visible = true, upright = true, rotate = true, children }: {
  route: Route
  progress: number
  duration?: number
  delay?: number
  visible?: boolean
  /** keep glyph upright (mirror when heading left) instead of rotating fully */
  upright?: boolean
  /** false = never rotate (cargo containers stay square to the page) */
  rotate?: boolean
  children: ReactNode
}) {
  const d = useDur()
  const { mode } = useEnv()
  const mv = useMotionValue(mode === 'print' ? progress : 0)
  useEffect(() => {
    const c = animate(mv, progress, { duration: d(duration), delay: d(delay), ease: easeInOut })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, duration, delay])
  const x = useTransform(mv, (s) => route.pointAt(s).x)
  const y = useTransform(mv, (s) => route.pointAt(s).y)
  const rot = useTransform(mv, (s) => {
    const a = route.pointAt(s).angle
    const flip = Math.abs(a) > 90
    const aa = flip ? a + (a > 0 ? -180 : 180) : a
    if (!rotate) return 0
    return upright ? aa * 0.5 : a
  })
  const sx = useTransform(mv, (s) => (upright && Math.abs(route.pointAt(s).angle) > 90 ? -1 : 1))
  return (
    <motion.g
      style={{ x, y, rotate: rot, scaleX: sx }}
      initial={{ opacity: visible ? 1 : 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: d(0.25) }}
    >
      {children}
    </motion.g>
  )
}
