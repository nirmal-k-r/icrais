import { useEffect, useState, type ReactNode } from 'react'

export const STAGE_W = 1920
export const STAGE_H = 1080

function fit() {
  const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H)
  return {
    s,
    x: (window.innerWidth - STAGE_W * s) / 2,
    y: (window.innerHeight - STAGE_H * s) / 2,
  }
}

export function Stage({ children }: { children: ReactNode }) {
  const [f, setF] = useState(fit)
  useEffect(() => {
    const on = () => setF(fit())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: STAGE_W,
        height: STAGE_H,
        transformOrigin: '0 0',
        transform: `translate(${f.x}px, ${f.y}px) scale(${f.s})`,
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {children}
    </div>
  )
}
