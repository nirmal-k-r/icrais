export interface Nav {
  scene: number
  step: number
}

/** `steps[i]` = number of reveal states in scene i (valid steps 0..steps[i]-1). */
export function next(n: Nav, steps: number[]): Nav {
  if (n.step < steps[n.scene] - 1) return { scene: n.scene, step: n.step + 1 }
  if (n.scene < steps.length - 1) return { scene: n.scene + 1, step: 0 }
  return n
}

export function prev(n: Nav, steps: number[]): Nav {
  if (n.step > 0) return { scene: n.scene, step: n.step - 1 }
  if (n.scene > 0) return { scene: n.scene - 1, step: steps[n.scene - 1] - 1 }
  return n
}

export function goto(scene: number, steps: number[], step = 0): Nav {
  const s = Math.max(0, Math.min(steps.length - 1, scene))
  return { scene: s, step: Math.max(0, Math.min(steps[s] - 1, step)) }
}

export const home = (): Nav => ({ scene: 0, step: 0 })

export function end(steps: number[]): Nav {
  const s = steps.length - 1
  return { scene: s, step: steps[s] - 1 }
}

export function toHash(ids: string[], n: Nav): string {
  return `#/${ids[n.scene]}/${n.step}`
}

export function fromHash(hash: string, ids: string[], steps: number[]): Nav {
  const m = /^#\/([^/]+)\/(\d+)$/.exec(hash)
  if (!m) return home()
  const i = ids.indexOf(m[1])
  return i < 0 ? home() : goto(i, steps, Number(m[2]))
}
