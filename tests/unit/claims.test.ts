import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { claims } from '../../src/content/claims'

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
const files = {
  paper: norm(readFileSync(path.resolve('sources/paper.txt'), 'utf8')),
  solver: norm(readFileSync(path.resolve('sources/solver_ga_v20_b.py'), 'utf8')),
}

describe('claims ledger', () => {
  it('has unique ids', () => {
    const ids = claims.map((x) => x.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every quote exists in its source file', () => {
    const missing = claims
      .filter((x) => x.quote && !files[x.quoteFile!].includes(norm(x.quote)))
      .map((x) => `${x.id}: "${x.quote}"`)
    expect(missing).toEqual([])
  })
  it('published claims carry a quote', () => {
    expect(claims.filter((x) => x.status === 'published' && !x.quote).map((x) => x.id)).toEqual([])
  })
})
