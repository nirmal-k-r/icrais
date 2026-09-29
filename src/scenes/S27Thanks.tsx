import QRCode from 'qrcode'
import { useMemo } from 'react'
import type { SceneProps } from '../content/scenes'
import { Reveal } from '../components/Reveal'
import { T, abs } from '../styles/type'

const LINKEDIN = 'https://www.linkedin.com/in/nirmal-rampersand/'
const EMAIL = 'nirkramp@gmail.com'

/** QR code drawn as SVG rects on a fixed white tile so it scans in both themes. */
function Qr({ text, size }: { text: string; size: number }) {
  const { n, cells } = useMemo(() => {
    const q = QRCode.create(text, { errorCorrectionLevel: 'M' })
    const n = q.modules.size
    const cells: string[] = []
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.get(x, y)) cells.push(`M${x} ${y}h1v1h-1z`)
    return { n, cells: cells.join('') }
  }, [text])
  const pad = 2
  return (
    <svg width={size} height={size} viewBox={`${-pad} ${-pad} ${n + 2 * pad} ${n + 2 * pad}`} shapeRendering="crispEdges" role="img" aria-label="QR code linking to Nirmal Rampersand on LinkedIn">
      <rect x={-pad} y={-pad} width={n + 2 * pad} height={n + 2 * pad} fill="#ffffff" rx={1.2} />
      <path d={cells} fill="#111318" />
    </svg>
  )
}

export function S27Thanks({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show y={30} dur={0.8} style={abs(120, 230, { fontSize: 190, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 })}>
        Thank you
      </Reveal>
      <Reveal show delay={0.5} style={abs(126, 450, { ...T.h2, fontSize: 44, color: 'var(--muted)' })}>
        Questions are welcome
      </Reveal>
      <Reveal show={step >= 1} delay={0.1} style={abs(120, 640, { width: 900 })}>
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-0.02em' }}>Nirmal Rampersand</div>
        <div style={{ ...T.body, color: 'var(--ink-2)', marginTop: 4 }}>University of Mauritius</div>
        <div style={{ ...T.label, fontSize: 22, fontWeight: 400, color: 'var(--muted)', marginTop: 34 }}>Email</div>
        <div className="mono" style={{ fontSize: 38, color: 'var(--cobalt)' }}>{EMAIL}</div>
      </Reveal>
      <Reveal show={step >= 1} delay={0.35} style={abs(1290, 250, { width: 510 })}>
        <div style={{ width: 400 }}><Qr text={LINKEDIN} size={400} /></div>
        <div style={{ ...T.label, fontSize: 28, fontWeight: 600, marginTop: 22 }}>Scan to connect on LinkedIn</div>
        <div className="mono" style={{ ...T.label, fontSize: 20, fontWeight: 400, color: 'var(--muted)', marginTop: 6 }}>linkedin.com/in/nirmal-rampersand</div>
      </Reveal>
    </div>
  )
}
