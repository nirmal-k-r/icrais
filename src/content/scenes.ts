import type { FC } from 'react'
import type { Mode } from '../engine/motion'
import { S01Title } from '../scenes/S01Title'
import { S02Question } from '../scenes/S02Question'
import { S09Tiers } from '../scenes/S09Tiers'
import { S10Journey } from '../scenes/S10Journey'
import { S17Convergence } from '../scenes/S17Convergence'
import { S03Translate } from '../scenes/S03Translate'
import { S04Lsndp } from '../scenes/S04Lsndp'
import { S05Challenges } from '../scenes/S05Challenges'
import { S05bRelated } from '../scenes/S05bRelated'
import { S06WorldSmall } from '../scenes/S06WorldSmall'
import { S07Baseline } from '../scenes/S07Baseline'
import { S08Framework } from '../scenes/S08Framework'
import { S11Chromosome } from '../scenes/S11Chromosome'
import { S12Objectives } from '../scenes/S12Objectives'
import { S13Fitness } from '../scenes/S13Fitness'
import { S14Penalty } from '../scenes/S14Penalty'
import { S15Search } from '../scenes/S15Search'
import { S16Headline } from '../scenes/S16Headline'
import { S18Costs } from '../scenes/S18Costs'
import { S19Breakdown } from '../scenes/S19Breakdown'
import { S20Regions } from '../scenes/S20Regions'
import { S21Fleet } from '../scenes/S21Fleet'
import { S22Literature } from '../scenes/S22Literature'
import { S22bInstances } from '../scenes/S22bInstances'
import { S23Algorithm } from '../scenes/S23Algorithm'
import { S23Findings } from '../scenes/S23Findings'
import { S24Next } from '../scenes/S24Next'
import { S25Close } from '../scenes/S25Close'
import { S27Thanks } from '../scenes/S27Thanks'
import { S28References } from '../scenes/S28References'

export interface SceneProps {
  step: number
  mode: Mode
}
export interface SceneDef {
  id: string
  act: 1 | 2 | 3 | 4 | 5 | 6 | 'appendix'
  title: string
  steps: number
  printStep?: number
  targetSeconds: number
  continuesFrom?: string
  sources: string[]
  Component: FC<SceneProps>
}

export const mainScenes: SceneDef[] = [
  { id: 'title', act: 1, title: 'Title', steps: 2, targetSeconds: 20, sources: [], Component: S01Title },
  { id: 'question', act: 1, title: 'The question', steps: 4, targetSeconds: 30, sources: [], Component: S02Question },
  { id: 'translate', act: 1, title: 'GA + LSNDP', steps: 3, targetSeconds: 15, sources: [], Component: S03Translate },
  { id: 'lsndp', act: 1, title: 'The problem', steps: 5, targetSeconds: 40, sources: [], Component: S04Lsndp },
  { id: 'challenges', act: 1, title: 'Why methods struggle', steps: 3, targetSeconds: 25, sources: ['paper.mipTime', 'paper.mipPorts'], Component: S05Challenges },
  { id: 'related', act: 1, title: 'Related work', steps: 4, targetSeconds: 25, sources: [], Component: S05bRelated },
  { id: 'worldsmall', act: 2, title: 'Why WorldSmall?', steps: 3, targetSeconds: 30, sources: ['inst.ports', 'inst.vessels', 'inst.odPairs', 'inst.demand'], Component: S06WorldSmall },
  { id: 'baseline', act: 2, title: 'Baseline GA', steps: 2, targetSeconds: 20, sources: ['paper.baselineBaltic', 'paper.baselineWS'], Component: S07Baseline },
  { id: 'framework', act: 3, title: 'What we propose', steps: 4, targetSeconds: 25, sources: [], Component: S08Framework },
  { id: 'tiers', act: 3, title: 'Four service tiers', steps: 5, targetSeconds: 40, sources: [], Component: S09Tiers },
  { id: 'journey', act: 3, title: 'Cargo journey', steps: 4, targetSeconds: 25, continuesFrom: 'tiers', sources: [], Component: S10Journey },
  { id: 'chromosome', act: 3, title: 'Chromosome', steps: 4, targetSeconds: 40, continuesFrom: 'journey', sources: ['gene.route'], Component: S11Chromosome },
  { id: 'objectives', act: 4, title: 'Two objectives', steps: 3, targetSeconds: 20, sources: [], Component: S12Objectives },
  { id: 'fitness', act: 4, title: 'Fitness score', steps: 5, targetSeconds: 40, sources: ['fit.alphaPos', 'fit.alphaNeg', 'fit.delivery90text'], Component: S13Fitness },
  { id: 'penalty', act: 4, title: 'Fleet penalty', steps: 3, targetSeconds: 25, sources: ['fit.penaltyPerVessel', 'pen.amount'], Component: S14Penalty },
  { id: 'search', act: 4, title: 'Genetic search', steps: 4, targetSeconds: 35, sources: ['mut.start', 'mut.end', 'cfg.population'], Component: S15Search },
  { id: 'headline', act: 5, title: 'Reported results', steps: 4, targetSeconds: 35, sources: ['paper.delivery', 'paper.profit', 'paper.baselineWS'], Component: S16Headline },
  { id: 'convergence', act: 5, title: 'Convergence', steps: 5, targetSeconds: 45, sources: ['run.profit', 'run.delivery', 'run.vessels'], Component: S17Convergence },
  { id: 'costs', act: 5, title: 'Cost evolution', steps: 3, targetSeconds: 30, sources: ['run.cost.bunker'], Component: S18Costs },
  { id: 'breakdown', act: 5, title: 'Cost breakdown', steps: 3, targetSeconds: 20, sources: ['run.cost', 'run.revenue'], Component: S19Breakdown },
  { id: 'regions', act: 5, title: 'Regional delivery', steps: 3, targetSeconds: 25, sources: ['run.region.Europe.Europe', 'paper.regionsAbove90', 'paper.transhipShare'], Component: S20Regions },
  { id: 'fleet', act: 5, title: 'Fleet', steps: 2, targetSeconds: 15, sources: ['inst.fleet.Feeder_450', 'paper.vessels'], Component: S21Fleet },
  { id: 'literature', act: 5, title: 'Published results', steps: 3, targetSeconds: 25, sources: ['lit.koza.profit', 'lit.karsten.profit', 'lit.brouer.profit', 'paper.deliveryLit'], Component: S22Literature },
  { id: 'instances', act: 5, title: 'Other instances', steps: 3, targetSeconds: 25, sources: ['exp.Baltic.mt.profit', 'exp.WAF.mt.delivery', 'exp.Mediterranean.mt.profit', 'exp.Pacific.mt.profit'], Component: S22bInstances },
  { id: 'algorithm', act: 6, title: 'Algorithmic lessons', steps: 4, targetSeconds: 30, sources: ['cfg.elites'], Component: S23Algorithm },
  { id: 'findings', act: 6, title: 'What we learned', steps: 3, targetSeconds: 30, sources: ['paper.delivery', 'paper.profit'], Component: S23Findings },
  { id: 'next', act: 6, title: 'What next', steps: 3, targetSeconds: 20, sources: [], Component: S24Next },
  { id: 'close', act: 6, title: 'Close', steps: 3, targetSeconds: 25, sources: ['paper.delivery', 'paper.profit'], Component: S25Close },
  { id: 'references', act: 6, title: 'References', steps: 1, targetSeconds: 0, sources: [], Component: S28References },
  { id: 'thanks', act: 6, title: 'Thank you', steps: 2, targetSeconds: 5, sources: [], Component: S27Thanks },
]
export const appendixScenes: SceneDef[] = []

export const getScenes = (includeAppendix: boolean): SceneDef[] =>
  includeAppendix ? [...mainScenes, ...appendixScenes] : mainScenes
