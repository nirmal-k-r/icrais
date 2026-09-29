import type { MotionPref } from './motion'

export type Theme = 'light' | 'dark'

export function readPref<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return allowed.includes(v as T) ? (v as T) : fallback
  } catch {
    return fallback
  }
}
export function writePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable: preference just isn't remembered */
  }
}
export const THEMES = ['light', 'dark'] as const
export const MOTION_PREFS = ['system', 'reduce', 'full'] as const satisfies readonly MotionPref[]
