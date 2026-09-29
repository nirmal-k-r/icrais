import { motion } from 'motion/react'
import { useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const TEXT = {
  paper: 'Reported in the paper',
  figrun: 'Example run (paper Fig. 2)',
  illustrative: 'Illustrative',
  instance: 'WorldSmall instance (LINER-LIB)',
} as const
export type CueKind = keyof typeof TEXT

export function ProvenanceCue({ kind, show = true, x = 120, y = 1000 }: { kind: CueKind | CueKind[]; show?: boolean; x?: number; y?: number }) {
  const d = useDur()
  const kinds = Array.isArray(kind) ? kind : [kind]
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: d(0.4) }}
      style={abs(x, y, { ...T.cue, color: 'var(--muted)' })}
    >
      {kinds.map((k, i) => (i ? TEXT[k].charAt(0).toLowerCase() + TEXT[k].slice(1) : TEXT[k])).join(' and ')}
    </motion.div>
  )
}
