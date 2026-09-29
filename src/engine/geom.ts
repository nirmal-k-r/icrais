export interface Pt {
  x: number
  y: number
}
/** Every network link is a quadratic curve (bend=0 gives a straight line). */
export interface Quad {
  a: Pt
  c: Pt
  b: Pt
}

export function link(a: Pt, b: Pt, bend = 0): Quad {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  // positive bend pushes the control point to the left of a→b in screen space
  return { a, b, c: { x: mx + (dy / len) * bend, y: my - (dx / len) * bend } }
}

export const quadD = (q: Quad) => `M${q.a.x} ${q.a.y} Q${q.c.x} ${q.c.y} ${q.b.x} ${q.b.y}`
export const chainD = (qs: Quad[]) =>
  `M${qs[0].a.x} ${qs[0].a.y} ` + qs.map((q) => `Q${q.c.x} ${q.c.y} ${q.b.x} ${q.b.y}`).join(' ')

export function quadAt(q: Quad, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * q.a.x + 2 * u * t * q.c.x + t * t * q.b.x,
    y: u * u * q.a.y + 2 * u * t * q.c.y + t * t * q.b.y,
  }
}
function quadTan(q: Quad, t: number): Pt {
  const u = 1 - t
  return {
    x: 2 * u * (q.c.x - q.a.x) + 2 * t * (q.b.x - q.c.x),
    y: 2 * u * (q.c.y - q.a.y) + 2 * t * (q.b.y - q.c.y),
  }
}

export interface Route {
  length: number
  /** s in 0..1 by arc length */
  pointAt(s: number): Pt & { angle: number }
  /** fraction of total length at which each leg ends */
  legEnds: number[]
}

const N = 48
export function makeRoute(qs: Quad[]): Route {
  const table: { s: number; qi: number; t: number }[] = []
  let acc = 0
  const legAcc: number[] = []
  qs.forEach((q, qi) => {
    let prev = quadAt(q, 0)
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const p = quadAt(q, t)
      if (i > 0) acc += Math.hypot(p.x - prev.x, p.y - prev.y)
      table.push({ s: acc, qi, t })
      prev = p
    }
    legAcc.push(acc)
  })
  const length = acc || 1
  return {
    length,
    legEnds: legAcc.map((l) => l / length),
    pointAt(s) {
      const target = Math.max(0, Math.min(1, s)) * length
      let lo = 0
      let hi = table.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (table[mid].s < target) lo = mid + 1
        else hi = mid
      }
      const e = table[lo]
      const q = qs[e.qi]
      const p = quadAt(q, e.t)
      const tg = quadTan(q, e.t)
      return { ...p, angle: (Math.atan2(tg.y, tg.x) * 180) / Math.PI }
    },
  }
}
