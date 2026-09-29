import { createContext, useContext } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const
export const easeInOut = [0.65, 0, 0.35, 1] as const
/** Pace follows the task: text is quick, drawing a route is medium, a network-wide morph is slow. */
export const dur = { fast: 0.25, base: 0.45, draw: 0.9, major: 1.2, chart: 1.4 }

export type Mode = 'live' | 'print'
export type MotionPref = 'system' | 'reduce' | 'full'

export interface SceneEnv {
  mode: Mode
  reduced: boolean
}
export const SceneEnvCtx = createContext<SceneEnv>({ mode: 'live', reduced: false })

/** Scales a duration: 0 in print, short opacity-only in reduced motion. */
export function useDur() {
  const { mode, reduced } = useContext(SceneEnvCtx)
  return (d: number) => (mode === 'print' ? 0 : reduced ? Math.min(d, 0.15) : d)
}
export function useEnv() {
  return useContext(SceneEnvCtx)
}
