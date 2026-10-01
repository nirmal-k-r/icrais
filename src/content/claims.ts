/**
 * Every number the app may show lives here. Scenes reference claims by id.
 * status: published (paper text) | figure-run (paper Fig. 2 run) | instance (LINER-LIB WorldSmall input)
 *       | illustrative (conceptual example) | derived | exploratory (appendix only)
 */
export type ClaimStatus = 'published' | 'figure-run' | 'instance' | 'illustrative' | 'derived' | 'exploratory' | 'solution-run'
export type QuoteFile = 'paper' | 'solver'

export interface Claim {
  id: string
  display: string
  value?: number
  status: ClaimStatus
  source: string
  /** Substring that must exist (whitespace-normalised) in the named source file. */
  quote?: string
  quoteFile?: QuoteFile
}

const c = (
  id: string, display: string, status: ClaimStatus, source: string,
  extra: Partial<Claim> = {},
): Claim => ({ id, display, status, source, ...extra })
const paper = (id: string, display: string, quote: string, value?: number) =>
  c(id, display, 'published', 'submission_paper.pdf', { quote, quoteFile: 'paper', value })
const solver = (id: string, display: string, quote: string, value?: number) =>
  c(id, display, 'published', 'solver_ga_v20_b.py', { quote, quoteFile: 'solver', value })
const run = (id: string, display: string, value?: number) =>
  c(id, display, 'figure-run', 'paper results/ (paper Fig. 2 run)', { value })
const inst = (id: string, display: string, value?: number) =>
  c(id, display, 'instance', 'results_ga_v20_b/ports.csv, vessels.csv (WorldSmall inputs)', { value })
const illus = (id: string, display: string, value?: number) =>
  c(id, display, 'illustrative', 'ga encoding.png / worked example', { value })

import instances from '../data/instances.json'
import solution from '../data/solution.json'

const solClaim = (id: string, v: number) =>
  c(id, String(v), 'solution-run', 'results_pso_wl_v10_final/seed42/results.json (PSO on WorldLarge, seed 42)', { value: v })
const money = (v: number) => `${v < 0 ? '−' : ''}$${Math.abs(v).toFixed(2)}M`
const expClaim = (id: string, display: string, value: number) =>
  c(id, display, 'exploratory', 'results/results_ga_baseline/comparison.json (one run per instance, seed 42; Multi-Tier = scaled variant)', { value })
/** Baseline GA vs Multi-Tier GA on the instances smaller than WorldSmall (exploratory, not in the paper). */
const instanceClaims: Claim[] = instances.flatMap((i) => [
  expClaim(`exp.${i.name}.ports`, String(i.ports), i.ports),
  expClaim(`exp.${i.name}.vessels`, String(i.vessels), i.vessels),
  ...(['base', 'mt'] as const).flatMap((side) => [
    expClaim(`exp.${i.name}.${side}.delivery`, `${i[side].delivery.toFixed(1)}%`, i[side].delivery),
    expClaim(`exp.${i.name}.${side}.profit`, money(i[side].profitM), i[side].profitM),
  ]),
])

export const claims: Claim[] = [
  // ---- published headline
  paper('paper.delivery', '≈ 91%', 'Demand delivery averaged at 91.5 %', 91.5),
  paper('paper.delivery1dp', '91.5%', 'Demand delivery averaged at 91.5 %', 91.5),
  paper('paper.deliveryLit', '91.2%', 'achieves 91.2%', 91.2),
  paper('paper.profit', '$37.2M', '37.2 x 106 USD', 37.2),
  paper('paper.runtime', '157.7 s', 'average of 157.7 seconds', 157.7),
  paper('paper.vessels', '171', 'Only 171 vessels were used', 171),
  paper('paper.baselineWS', '15.9%', 'only achieving 15.9% demand delivery', 15.9),
  paper('paper.baselineBaltic', '99.6%', 'delivery 99.6% demand', 99.6),
  c('paper.deltaPoints', '+75.6 percentage points', 'derived', '91.5 − 15.9 (paper values)', { value: 75.6 }),
  paper('paper.transhipShare', '≈ 90%', 'Approximately 90% of the cargo delivered was transhipped', 90),
  c('paper.directShare', '≈ 10%', 'published', 'submission_paper.pdf', { quote: 'only 10% was transported using direct services', quoteFile: 'paper', value: 10 }),
  paper('paper.regionsAbove90', 'Every region pair above 90%', 'exceeded 90% in all scenarios'),
  paper('paper.mipTime', '> 10,800 s', 'higher than 10800', 10800),
  paper('paper.mipPorts', '19 ports', 'instances with 19-ports only'),
  // ---- literature
  paper('lit.koza.profit', '$32.7M', '3.27 × 10⁷ and 86.4%', 32.7),
  paper('lit.koza.delivery', '86.4%', '3.27 × 10⁷ and 86.4%', 86.4),
  paper('lit.karsten.profit', '$31.5M', '3.15 × 10⁷ and 82.3%', 31.5),
  paper('lit.karsten.delivery', '82.3%', '3.15 × 10⁷ and 82.3%', 82.3),
  paper('lit.brouer.profit', '−$1.1M', 'of −1.1 × 106 and 78.3%', -1.1),
  paper('lit.brouer.delivery', '78.3%', 'of −1.1 × 106 and 78.3%', 78.3),
  // ---- configuration (paper p.8-9, solver constants)
  paper('cfg.population', '200', 'population of 200 individuals', 200),
  paper('cfg.elites', '25', 'elitism preservation of 25 individuals', 25),
  solver('cfg.generations', '200', 'GENERATIONS = 200', 200),
  paper('cfg.stagnation', '30', 'over 30 consecutive generations', 30),
  paper('cfg.directThreshold', '260 FFE', 'threshold of 260 FFE', 260),
  paper('cfg.directRoutes', '≥ 75', 'at least 75 direct routes', 75),
  paper('cfg.minVessels', '50', 'threshold of 50 vessels', 50),
  solver('cfg.cycleWeeks', '≤ 8 weeks', 'ROUTE_CYCLE_WEEKS = 8', 8),
  // ---- fitness + mutation
  solver('fit.alphaPos', '2.2M', '2200000 * demand_pct', 2.2e6),
  solver('fit.alphaNeg', '1.3M', '1300000 * demand_pct', 1.3e6),
  solver('fit.penaltyPerVessel', '$300,000', '300000 * (MIN_VESSELS_THRESHOLD - vessels)', 3e5),
  solver('mut.start', '45%', 'BASE_MUTATION_RATE = 0.45', 0.45),
  solver('mut.formula', '0.45 × (1 − g / 400)', 'BASE_MUTATION_RATE * (1 - gen / (GENERATIONS * 2))'),
  c('mut.end', '≈ 22.5%', 'derived', '0.45 × (1 − 200/400)', { value: 0.225 }),
  c('fit.delivery90', '≈ $198M', 'derived', '2.2M × 90 delivery points', { value: 198e6 }),
  c('fit.delivery90text', 'At 90% delivery, the delivery term is worth ≈ $198M', 'derived', '2.2M × 90 delivery points', { value: 198e6 }),
  // ---- figure run (paper Fig. 2)
  run('run.profit', '$37.2M', 37.21),
  run('run.revenue', '$216.6M', 216.6),
  run('run.cost', '$179.4M', 179.4),
  run('run.delivery', '92.0%', 92.0),
  run('run.vessels', '168', 168),
  run('run.cost.bunker', '$69.4M', 69.4),
  run('run.cost.handling', '$53.2M', 53.2),
  run('run.cost.tc', '$42.3M', 42.3),
  run('run.cost.canal', '$15.0M', 15.0),
  run('run.cost.port', '$3.0M', 3.0),
  run('run.cost.bunker.pct', '38.0%', 38.0),
  run('run.cost.handling.pct', '29.1%', 29.1),
  run('run.cost.tc.pct', '23.1%', 23.1),
  run('run.cost.canal.pct', '8.2%', 8.2),
  run('run.cost.port.pct', '1.6%', 1.6),
  run('run.top3Share', '≈ 90% of operating cost', 90),
  run('run.start.vessels', '≈ 227', 227),
  run('run.start.profit', '≈ −$485M', -485),
  run('run.profitCrossGen', '~gen 100', 100),
  run('run.deliveryStableGen', '~gen 111', 111),
  c('run.roundingNote', 'Rounded for display: the exact values are $216.597M revenue, $179.388M cost and $37.208M profit.', 'figure-run', 'visualize_v20_b.ipynb output / paper results/v20b_summary.png'),
  run('run.profitCrossText', 'Profitable from ~gen 100'),
  run('run.deliveryStableText', 'Stable above 90% from ~gen 111'),
  run('run.region.Europe.Europe', '100.0%', 100.0),
  run('run.region.Europe.Asia', '95.3%', 95.3),
  run('run.region.Europe.Americas', '96.3%', 96.3),
  run('run.region.Asia.Europe', '93.4%', 93.4),
  run('run.region.Asia.Asia', '99.8%', 99.8),
  run('run.region.Asia.Americas', '92.2%', 92.2),
  run('run.region.Americas.Europe', '97.4%', 97.4),
  run('run.region.Americas.Asia', '95.5%', 95.5),
  run('run.region.Americas.Americas', '90.1%', 90.1),
  // ---- WorldSmall instance
  inst('inst.ports', '47', 47),
  inst('inst.vessels', '263', 263),
  inst('inst.odPairs', '1,764', 1764),
  inst('inst.demand', '128k', 128281),
  inst('inst.fleet.Feeder_450', '24', 24),
  inst('inst.fleet.Feeder_800', '29', 29),
  inst('inst.fleet.Panamax_1200', '68', 68),
  inst('inst.fleet.Panamax_2400', '74', 74),
  inst('inst.fleet.Post_panamax', '58', 58),
  inst('inst.fleet.Super_panamax', '10', 10),
  // ---- illustrative
  illus('gene.route', 'R7'),
  illus('gene.vessel', 'V5'),
  illus('gene.class', 'Trunk'),
  illus('gene.nPorts', '6', 6),
  illus('gene.sequence', 'P12 P05 P08 P21 P17 P12'),
  illus('gene.frequency', '2 / week', 2),
  illus('pen.vessels', '40', 40),
  illus('pen.below', '10', 10),
  illus('pen.amount', '−$3M', -3),
  illus('pen.each', '−$300k', -0.3),
  ...instanceClaims,
  // one real solution on WorldLarge (the authors' saved run, from another algorithm; see the speaker notes): structure only
  solClaim('sol.services', solution.services),
  solClaim('sol.ports', solution.portCount),
  solClaim('sol.direct', solution.direct),
  solClaim('sol.trunk', solution.trunk),
  solClaim('sol.feeder', solution.feeder),
  solClaim('sol.loopPorts', solution.loop.ports.length),
  solClaim('sol.loopVessels', solution.loop.vessels),
]

const byId = new Map(claims.map((x) => [x.id, x]))

export function getClaim(id: string): Claim {
  const x = byId.get(id)
  if (!x) throw new Error(`Unknown claim id: ${id}`)
  return x
}
export const claim = (id: string): string => getClaim(id).display
export const num = (id: string): number => {
  const v = getClaim(id).value
  if (v === undefined) throw new Error(`Claim ${id} has no numeric value`)
  return v
}
export const claimExists = (id: string): boolean => byId.has(id)
