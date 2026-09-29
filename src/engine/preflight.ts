import conv from '../data/figrun-convergence.json'
import costs from '../data/figrun-costs.json'
import land from '../data/land-110m.json'
import ports from '../data/ports.json'
import fleet from '../data/fleet.json'
import { mainScenes } from '../content/scenes'
import { notes } from '../content/notes'

/** Verifies everything the show depends on before it is ever shown. Returns human-readable problems. */
export async function runPreflight(): Promise<string[]> {
  const bad: string[] = []
  const need = (ok: boolean, msg: string) => ok || bad.push(msg)
  need(ports.length === 47 && ports.filter((p) => p.isHub).length === 7, 'Port data: expected 47 ports with 7 hubs')
  need(fleet.reduce((t, f) => t + f.quantity, 0) === 263, 'Fleet data: expected 263 vessels')
  need(!!(land as { objects?: { land?: unknown } }).objects?.land, 'Map data (land-110m) is missing')
  for (const [name, o] of Object.entries({ convergence: conv, costs })) {
    for (const [k, v] of Object.entries(o)) need(Array.isArray(v) && v.length === 200 && v.every((x) => Number.isFinite(x)), `Chart data ${name}.${k}: expected 200 finite values`)
  }
  need(mainScenes.every((s) => !!notes[s.id]), 'Speaker notes missing for a scene')
  try {
    await Promise.all([document.fonts.load('600 24px "Hanken Grotesk Variable"'), document.fonts.load('500 24px "DM Mono"')])
    need(document.fonts.check('600 24px "Hanken Grotesk Variable"') && document.fonts.check('500 24px "DM Mono"'), 'Fonts failed to load')
  } catch {
    bad.push('Font loading API failed')
  }
  return bad
}
