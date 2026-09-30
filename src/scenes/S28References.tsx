import type { SceneProps } from '../content/scenes'
import { formatRef, sortedReferences } from '../content/references'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

export function S28References(_: SceneProps) {
  const refs = sortedReferences()
  const half = Math.ceil(refs.length / 2)
  const col = (list: typeof refs, x: number) => (
    <div style={abs(x, 210, { width: 790 })}>
      {list.map((r) => (
        <div key={r.id} style={{ ...T.label, fontSize: 21, lineHeight: 1.35, fontWeight: 400, color: 'var(--ink-2)', marginBottom: 14 }}>
          {formatRef(r)}
        </div>
      ))}
    </div>
  )
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1s })}>References</Reveal>
      {col(refs.slice(0, half), 120)}
      {col(refs.slice(half), 1010)}
    </div>
  )
}
