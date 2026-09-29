export type Tier = 'direct' | 'trunk' | 'feeder' | 'loop'
export interface TierStyle {
  w: number
  color: string
  dash?: string
  label: string
}
export const tierStyle: Record<Tier, TierStyle> = {
  direct: { w: 5, color: 'var(--ink)', label: 'Direct' },
  trunk: { w: 9, color: 'var(--cobalt)', label: 'Trunk' },
  feeder: { w: 4, color: 'var(--violet)', dash: '10 8', label: 'Feeder' },
  loop: { w: 3, color: 'var(--muted)', dash: '2 7', label: 'Regional loop' },
}
