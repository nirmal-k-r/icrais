import { useEffect } from 'react'

export interface KeyActions {
  next(): void
  prev(): void
  home(): void
  end(): void
  fullscreen(): void
  escape(): void
  overview(): void
  help(): void
  theme(): void
  motion(): void
  black(): void
  print(): void
  restart(): void
  appendix(): void
  nextScene(): void
  auto(): void
  replay(): void
  prevScene(): void
}

const map: Record<string, keyof KeyActions> = {
  ArrowRight: 'next', ' ': 'next', PageDown: 'next', ArrowDown: 'next',
  ArrowLeft: 'prev', PageUp: 'prev', ArrowUp: 'prev',
  Home: 'home', End: 'end', Escape: 'escape',
  f: 'fullscreen', o: 'overview', h: 'help', '?': 'help', t: 'theme',
  m: 'motion', b: 'black', p: 'print', r: 'restart', a: 'appendix',
  s: 'auto', Enter: 'replay',
  ']': 'nextScene', '[': 'prevScene', '.': 'nextScene', ',': 'prevScene',
}

export function useKeyboard(a: KeyActions) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      // Shift + arrows jump a whole scene (no Page Up / Page Down needed on a MacBook)
      const action = e.shiftKey && (k === 'ArrowRight' || k === 'ArrowLeft') ? (k === 'ArrowRight' ? 'nextScene' : 'prevScene') : map[k]
      if (!action) return
      e.preventDefault()
      a[action]()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [a])
}
