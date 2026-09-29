/** A 18x12 container block (cargo = violet). Centred on (0,0). */
export function Container({ w = 18, h = 12, fill = 'var(--violet)' }: { w?: number; h?: number; fill?: string }) {
  return <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={1.5} fill={fill} />
}

/** A simple ship: hull + deck containers. Centred on (0,0), ~72px long. */
export function Ship({ loaded = true, scale = 1 }: { loaded?: boolean; scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path d="M-38 -4 H38 L28 16 H-28 Z" fill="var(--ink)" />
      {loaded && (
        <>
          {[-24, -6, 12].map((x) => (
            <rect key={x} x={x} y={-18} width={16} height={12} rx={1.5} fill="var(--violet)" />
          ))}
          {[-15, 3].map((x) => (
            <rect key={x} x={x} y={-30} width={16} height={12} rx={1.5} fill="var(--violet)" opacity={0.75} />
          ))}
        </>
      )}
      <rect x={20} y={-22} width={12} height={18} rx={1.5} fill="var(--ink)" />
    </g>
  )
}
