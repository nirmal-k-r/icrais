import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { references } from '../../src/content/references'

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
const paper = norm(readFileSync(path.resolve('sources/paper.txt'), 'utf8'))
const dir = path.resolve('src/scenes')
const scenesSrc = readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => readFileSync(path.join(dir, f), 'utf8')).join('\n')
const citedIds = new Set([...scenesSrc.matchAll(/cite\(([^)]*)\)/g)].flatMap((m) => [...m[1].matchAll(/'([a-z0-9]+)'/g)].map((x) => x[1])))

describe('references', () => {
  it('ids and labels are unique', () => {
    expect(new Set(references.map((r) => r.id)).size).toBe(references.length)
    expect(new Set(references.map((r) => r.label)).size).toBe(references.length)
  })
  it("every paper-sourced reference matches the paper's own bibliography (authors and year)", () => {
    const missing = references.filter((r) => r.source === 'paper' && !paper.includes(norm(`${r.authors} (${r.year})`))).map((r) => r.id)
    expect(missing).toEqual([])
  })
  it('every added reference records a DOI or ISBN so it can be checked', () => {
    const bad = references.filter((r) => r.source === 'added' && !(r.isbn || /^10\.\d{4,}\//.test(r.doi ?? ''))).map((r) => r.id)
    expect(bad).toEqual([])
  })
  it('every scene citation exists, and every reference is cited somewhere', () => {
    const known = new Set(references.map((r) => r.id))
    expect([...citedIds].filter((id) => !known.has(id))).toEqual([])
    expect(references.filter((r) => !citedIds.has(r.id)).map((r) => r.id)).toEqual([])
  })
})
