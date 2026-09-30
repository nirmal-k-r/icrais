import { describe, expect, it } from 'vitest'
import { end, fromHash, goto, home, next, nextAuto, prev, prevAuto, toHash } from '../../src/engine/navReducer'

const steps = [2, 3, 1]
const ids = ['a', 'b', 'c']

describe('navReducer', () => {
  it('next advances a step, then a scene, then stops', () => {
    expect(next({ scene: 0, step: 0 }, steps)).toEqual({ scene: 0, step: 1 })
    expect(next({ scene: 0, step: 1 }, steps)).toEqual({ scene: 1, step: 0 })
    expect(next({ scene: 1, step: 2 }, steps)).toEqual({ scene: 2, step: 0 })
    expect(next({ scene: 2, step: 0 }, steps)).toEqual({ scene: 2, step: 0 })
  })
  it('prev reverses a step, then enters previous scene at its final state, then stops', () => {
    expect(prev({ scene: 1, step: 2 }, steps)).toEqual({ scene: 1, step: 1 })
    expect(prev({ scene: 1, step: 0 }, steps)).toEqual({ scene: 0, step: 1 })
    expect(prev({ scene: 2, step: 0 }, steps)).toEqual({ scene: 1, step: 2 })
    expect(prev(home(), steps)).toEqual(home())
  })
  it('goto clamps and defaults to step 0', () => {
    expect(goto(1, steps)).toEqual({ scene: 1, step: 0 })
    expect(goto(9, steps)).toEqual({ scene: 2, step: 0 })
    expect(goto(-3, steps)).toEqual({ scene: 0, step: 0 })
    expect(goto(1, steps, 99)).toEqual({ scene: 1, step: 2 })
  })
  it('end is the final step of the last scene', () => {
    expect(end(steps)).toEqual({ scene: 2, step: 0 })
    expect(end([2, 5])).toEqual({ scene: 1, step: 4 })
  })
  it('next then prev round-trips everywhere', () => {
    for (let s = 0; s < steps.length; s++)
      for (let t = 0; t < steps[s]; t++) {
        const n = { scene: s, step: t }
        const f = next(n, steps)
        if (f.scene !== n.scene || f.step !== n.step) expect(prev(f, steps)).toEqual(n)
      }
  })
  it('hash round-trips; invalid hash returns home', () => {
    const n = { scene: 1, step: 2 }
    expect(fromHash(toHash(ids, n), ids, steps)).toEqual(n)
    expect(fromHash('#/nope/1', ids, steps)).toEqual(home())
    expect(fromHash('', ids, steps)).toEqual(home())
    expect(fromHash('#/b/99', ids, steps)).toEqual({ scene: 1, step: 2 })
  })
  it('auto mode: next opens the next slide at its first state, previous shows the earlier slide complete', () => {
    expect(nextAuto({ scene: 0, step: 1 }, steps)).toEqual({ scene: 1, step: 0 })
    expect(nextAuto({ scene: 1, step: 0 }, steps)).toEqual({ scene: 2, step: 0 })
    expect(prevAuto({ scene: 1, step: 0 }, steps)).toEqual({ scene: 0, step: 1 })
    expect(prevAuto({ scene: 2, step: 0 }, steps)).toEqual({ scene: 1, step: 2 })
    expect(prevAuto({ scene: 0, step: 1 }, steps)).toEqual({ scene: 0, step: 0 })
    expect(nextAuto({ scene: 2, step: 0 }, steps)).toEqual({ scene: 2, step: 0 })
  })
})
