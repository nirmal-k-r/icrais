import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, type CSSProperties } from 'react'
import { ease, useDur, useEnv } from '../engine/motion'

/** Counts up to `to`; at rest it always shows the exact claim string `final`. */
export function CountUp({ to, final, show, fmt = (v) => v.toFixed(0), delay = 0, dur = 0.7, style }: {
  to: number
  final: string
  show: boolean
  fmt?: (v: number) => string
  delay?: number
  dur?: number
  style?: CSSProperties
}) {
  const d = useDur()
  const { mode } = useEnv()
  const mv = useMotionValue(mode === 'print' ? to : 0)
  useEffect(() => {
    const c = animate(mv, show ? to : 0, { duration: d(show ? dur : 0.25), delay: d(show ? delay : 0), ease })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, to])
  const text = useTransform(mv, (v) => (Math.abs(v - to) < 1e-6 ? final : fmt(v)))
  return <motion.span style={style}>{text}</motion.span>
}
