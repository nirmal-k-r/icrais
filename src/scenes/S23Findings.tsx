import type { SceneProps } from '../content/scenes'
import { claim } from '../content/claims'
import { Reveal } from '../components/Reveal'
import { ALL_LAYERS, TiersNetwork } from '../components/network/TiersNetwork'
import { T, abs } from '../styles/type'

export function S23Findings({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 96, { ...T.h1 })}>What we learned</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(870 200) scale(0.56)" opacity={0.32}>
          <TiersNetwork layers={ALL_LAYERS} startShown />
        </g>
      </svg>
      <div style={abs(120, 290, { width: 820 })}>
        <Reveal show={step >= 0} style={{ marginBottom: 56 }}>
          <div style={{ ...T.h2, fontSize: 44 }}><b style={{ color: 'var(--violet)' }}>Rewarding delivery</b> and penalising sparse fleets steers the search away from profitable but empty networks.</div>
        </Reveal>
        <Reveal show={step >= 1} style={{ marginBottom: 56 }}>
          <div style={{ ...T.h2, fontSize: 44 }}>A <b style={{ color: 'var(--cobalt)' }}>service hierarchy</b> keeps inter-regional cargo connected: {claim('paper.regionsAbove90').toLowerCase()}.</div>
        </Reveal>
        <Reveal show={step >= 2}>
          <div style={{ ...T.h2, fontSize: 44 }}><b>Together</b>, they reached {claim('paper.delivery')} delivery and {claim('paper.profit')} profit on WorldSmall.</div>
        </Reveal>
      </div>
    </div>
  )
}
