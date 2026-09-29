import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { claimExists } from '../../src/content/claims'
import { mainScenes } from '../../src/content/scenes'
import { notes } from '../../src/content/notes'

describe('scene registry', () => {
  it('has unique kebab-case ids and valid step counts', () => {
    const ids = mainScenes.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of mainScenes) {
      expect(s.id).toMatch(/^[a-z]+(-[a-z]+)*$/)
      expect(s.steps).toBeGreaterThan(0)
      expect(s.printStep ?? s.steps - 1).toBeLessThan(s.steps)
    }
  })
  it('matches the planned size and timing', () => {
    expect(mainScenes).toHaveLength(28)
    const steps = mainScenes.reduce((t, s) => t + s.steps, 0)
    const secs = mainScenes.reduce((t, s) => t + s.targetSeconds, 0)
    expect(steps).toBeGreaterThanOrEqual(80)
    expect(steps).toBeLessThanOrEqual(100)
    expect(secs).toBeGreaterThanOrEqual(11 * 60)
    expect(secs).toBeLessThanOrEqual(13 * 60)
  })
  it('continuesFrom refers to the immediately preceding scene', () => {
    mainScenes.forEach((s, i) => {
      if (s.continuesFrom) expect(mainScenes[i - 1].id).toBe(s.continuesFrom)
    })
  })
  it('every source claim exists', () => {
    const missing = mainScenes.flatMap((s) => s.sources.filter((id) => !claimExists(id)).map((id) => `${s.id}:${id}`))
    expect(missing).toEqual([])
  })
  it('never mixes paper-run and paper-text claims in one scene, except where labelled', () => {
    const allowed = new Set(['regions']) // matrix = example run, stacked bar = paper text; each has its own cue
    const mixed = mainScenes.filter((s) => s.sources.some((x) => x.startsWith('run.')) && s.sources.some((x) => x.startsWith('paper.')) && !allowed.has(s.id))
    expect(mixed.map((s) => s.id)).toEqual([])
  })
  it('exploratory claims appear only on the other-instances scene and are never mixed with paper or figure-run claims', () => {
    for (const s of mainScenes) {
      const exp = s.sources.filter((x) => x.startsWith('exp.'))
      if (s.id !== 'instances') expect(exp, s.id).toEqual([])
      else expect(s.sources.filter((x) => !x.startsWith('exp.')), s.id).toEqual([])
    }
  })
  it('every scene has a speaker note', () => {
    expect(mainScenes.filter((s) => !notes[s.id]).map((s) => s.id)).toEqual([])
  })
})

describe('no unexplained numbers in scene code', () => {
  const dir = path.resolve('src/scenes')
  const numberWithUnit = /(?<![\w.#$-])\d[\d,.]*\s?(%|M\b|FFE\b|vessels\b|weeks?\b|ports\b|generations\b)/g
  // words a presenter must never put on screen
  const banned = /\b(groundbreaking|revolutionary|proves?|optimal|Pareto)\b/i
  const files = readdirSync(dir).filter((f) => f.endsWith('.tsx'))
  it('scene files contain no literal quantities with units', () => {
    const hits: string[] = []
    for (const f of files) {
      readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((line, i) => {
        if (line.trim().startsWith('//')) return
        for (const m of line.matchAll(numberWithUnit)) hits.push(`${f}:${i + 1}: ${m[0]}`)
      })
    }
    expect(hits).toEqual([])
  })
  it('scene text avoids banned claims (except the required "not a Pareto front" disclaimer)', () => {
    const hits: string[] = []
    for (const f of files) {
      readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((line, i) => {
        if (banned.test(line) && !/not a Pareto front/.test(line)) hits.push(`${f}:${i + 1}: ${line.trim()}`)
      })
    }
    expect(hits).toEqual([])
  })
})
