import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { ease, useDur, useEnv } from '../engine/motion'

interface Props {
  show: boolean
  children: ReactNode
  style?: CSSProperties
  delay?: number
  dur?: number
  y?: number
  /** opacity when hidden (0 = gone, 0.3 = ghosted) */
  hidden?: number
  /** mount already visible (for scenes that continue from another) */
  startShown?: boolean
}

/** HTML reveal: enters with a small rise, leaves by fading. Target state is a pure function of `show`. */
export function Reveal({ show, children, style, delay = 0, dur = 0.45, y = 16, hidden = 0, startShown = false }: Props) {
  const d = useDur()
  const { mode } = useEnv()
  if (mode === 'print' && !show && hidden === 0) return null
  return (
    <motion.div
      initial={{ opacity: startShown ? 1 : hidden, y: startShown ? 0 : y }}
      animate={{ opacity: show ? 1 : hidden, y: show ? 0 : y }}
      transition={{ duration: d(show ? dur : 0.25), delay: d(show ? delay : 0), ease }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/** SVG-group version of Reveal. */
export function RevealG({ show, children, delay = 0, dur = 0.45, hidden = 0, opacity = 1, startShown = false }: {
  show: boolean; children: ReactNode; delay?: number; dur?: number; hidden?: number; opacity?: number; startShown?: boolean
}) {
  const d = useDur()
  const { mode } = useEnv()
  if (mode === 'print' && !show && hidden === 0) return null
  return (
    <motion.g
      initial={{ opacity: startShown ? opacity : hidden }}
      animate={{ opacity: show ? opacity : hidden }}
      transition={{ duration: d(show ? dur : 0.25), delay: d(show ? delay : 0), ease }}
    >
      {children}
    </motion.g>
  )
}
