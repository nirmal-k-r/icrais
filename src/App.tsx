import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getScenes } from './content/scenes'
import { end, fromHash, goto, home, next, prev, toHash, type Nav } from './engine/navReducer'
import { SceneEnvCtx, easeInOut, type MotionPref } from './engine/motion'
import { MOTION_PREFS, THEMES, readPref, writePref, type Theme } from './engine/prefs'
import { PrintView } from './engine/PrintView'
import { Presenter } from './engine/Presenter'
import { Stage } from './engine/Stage'
import { useKeyboard } from './engine/useKeyboard'
import { runPreflight } from './engine/preflight'
import { startRemote } from './engine/remote'

const params = new URLSearchParams(location.search)
const isPrint = params.has('print')

export function App() {
  const [theme, setTheme] = useState<Theme>(
    isPrint ? (params.get('theme') === 'dark' ? 'dark' : 'light') : readPref('theme', THEMES, 'light'),
  )
  const [motionPref, setMotionPref] = useState<MotionPref>(readPref('motion', MOTION_PREFS, 'system'))
  const [includeAppendix, setIncludeAppendix] = useState(params.has('appendix'))
  const scenes = useMemo(() => getScenes(includeAppendix), [includeAppendix])
  const steps = useMemo(() => scenes.map((s) => s.steps), [scenes])
  const ids = useMemo(() => scenes.map((s) => s.id), [scenes])

  const [nav, setNav] = useState<Nav>(() => fromHash(location.hash, ids, steps))
  const prevScene = useRef(nav.scene)
  const [systemReduce, setSystemReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [chrome, setChrome] = useState(false)
  const [overview, setOverview] = useState(false)
  const [help, setHelp] = useState(false)
  const [black, setBlack] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [idle, setIdle] = useState(false)
  const [problems, setProblems] = useState<string[]>([])
  const restartArmed = useRef(false)
  const timers = useRef<{ chrome?: number; toast?: number; restart?: number }>({})

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('print', isPrint)
    if (!isPrint) writePref('theme', theme)
  }, [theme])
  useEffect(() => writePref('motion', motionPref), [motionPref])
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setSystemReduce(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    if (!isPrint) history.replaceState(null, '', toHash(ids, nav))
  }, [ids, nav])
  useEffect(() => {
    if (nav.scene >= scenes.length) setNav(goto(scenes.length - 1, steps))
  }, [nav.scene, scenes.length, steps])

  useEffect(() => {
    void runPreflight().then(setProblems)
  }, [])

  const flash = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(timers.current.toast)
    timers.current.toast = window.setTimeout(() => setToast(null), 2200)
  }, [])
  const showChrome = useCallback((ms = 2000) => {
    setChrome(true)
    setIdle(false)
    window.clearTimeout(timers.current.chrome)
    timers.current.chrome = window.setTimeout(() => {
      setChrome(false)
      setIdle(true)
    }, ms)
  }, [])
  useEffect(() => {
    const on = () => showChrome()
    window.addEventListener('mousemove', on)
    return () => window.removeEventListener('mousemove', on)
  }, [showChrome])

  const move = useCallback((n: Nav) => {
    setNav((cur) => {
      prevScene.current = cur.scene
      return n
    })
  }, [])

  const actions = {
    next: () => move(next(nav, steps)),
    prev: () => move(prev(nav, steps)),
    nextScene: () => move(goto(nav.scene + 1, steps)),
    prevScene: () => move(goto(nav.scene - 1, steps)),
    home: () => move(home()),
    end: () => move(end(steps)),
    fullscreen: () => {
      if (document.fullscreenElement) void document.exitFullscreen()
      else void document.documentElement.requestFullscreen?.()
    },
    escape: () => {
      if (overview || help) {
        setOverview(false)
        setHelp(false)
      }
    },
    overview: () => setOverview((v) => !v),
    help: () => setHelp((v) => !v),
    theme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    motion: () =>
      setMotionPref((m) => {
        const n = MOTION_PREFS[(MOTION_PREFS.indexOf(m) + 1) % MOTION_PREFS.length]
        flash(`Motion: ${n}`)
        return n
      }),
    black: () => setBlack((v) => !v),
    print: () => window.open(`${location.pathname}?print&autoprint`, '_blank'),
    restart: () => {
      if (restartArmed.current) {
        restartArmed.current = false
        move(home())
        setToast(null)
      } else {
        restartArmed.current = true
        flash('Press R again to restart')
        window.clearTimeout(timers.current.restart)
        timers.current.restart = window.setTimeout(() => (restartArmed.current = false), 2200)
      }
    },
    appendix: () => {
      if (overview) setIncludeAppendix((v) => !v)
    },
  }
  useKeyboard(actions)

  // always-current view of the actions for the input listeners below (they are registered once)
  const live = useRef({ actions, blocked: false })
  live.current = { actions, blocked: overview || help }

  // optional remote control (phone or Apple Watch via the server); inert unless the page is opened with ?remote
  useEffect(() => startRemote((c) => live.current.actions[c]()), [])

  // Touch (finger or Apple Pencil): swipe left/right, tap the right side for next and the left side for back,
  // tap the bottom strip to reveal the controls. Uses real touch events because iPad Safari can drop pointer streams.
  useEffect(() => {
    let sx = 0, sy = 0, st = 0, on = false
    const inUi = (t: EventTarget | null) => !!(t as Element | null)?.closest?.('button, input, [role="dialog"]')
    const start = (e: TouchEvent) => {
      on = e.touches.length === 1 && !inUi(e.target)
      if (!on) return
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now()
    }
    const move = (e: TouchEvent) => {
      if (on && e.cancelable) e.preventDefault() // stop Safari rubber-banding / back-swipe while presenting
    }
    const end = (e: TouchEvent) => {
      if (!on) return
      on = false
      if (live.current.blocked) return
      if (e.cancelable) e.preventDefault() // no emulated mouse click afterwards (it could hit controls that just appeared)
      const t = e.changedTouches[0]
      const dx = t.clientX - sx, dy = t.clientY - sy, dt = Date.now() - st
      if (dt < 1200 && Math.abs(dx) >= 50 && Math.abs(dx) >= Math.abs(dy) * 1.3) {
        if (dx < 0) live.current.actions.next()
        else live.current.actions.prev()
      } else if (dt < 400 && Math.abs(dx) < 14 && Math.abs(dy) < 14) {
        if (t.clientY > window.innerHeight - 110) showChrome(6000)
        else if (t.clientX < window.innerWidth * 0.33) live.current.actions.prev()
        else live.current.actions.next()
      }
    }
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', end, { passive: false })
    window.addEventListener('touchcancel', () => (on = false), { passive: true })
    return () => {
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
    }
  }, [showChrome])

  // Scroll wheel / trackpad two-finger scroll: one scroll gesture = one step (inertia is swallowed)
  useEffect(() => {
    let acc = 0, locked = false, timer = 0
    const wheel = (e: WheelEvent) => {
      if (live.current.blocked || (e.target as Element | null)?.closest?.('[role="dialog"]') || e.ctrlKey) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => { locked = false; acc = 0 }, 200)
      if (locked) return
      acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(acc) > 60) {
        locked = true
        if (acc > 0) live.current.actions.next()
        else live.current.actions.prev()
      }
    }
    window.addEventListener('wheel', wheel, { passive: true })
    return () => window.removeEventListener('wheel', wheel)
  }, [])

  if (problems.length)
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#7a1010', color: '#fff', padding: 48, font: '24px/1.5 system-ui' }}>
        <h1>Preflight failed. Do not present until fixed.</h1>
        <ul>{problems.map((p) => <li key={p}>{p}</li>)}</ul>
      </div>
    )

  if (isPrint) return <PrintView scenes={scenes} withNotes={params.has('notes')} />

  const reduced = motionPref === 'reduce' || (motionPref === 'system' && systemReduce)
  const scene = scenes[Math.min(nav.scene, scenes.length - 1)]
  const other = scenes[prevScene.current]
  const instant = !!other && (scene.continuesFrom === other.id || other.continuesFrom === scene.id)
  const C = scene.Component
  const d = (x: number) => (instant || reduced ? Math.min(x, reduced ? 0.15 : 0) : x)

  return (
    <MotionConfig reducedMotion={motionPref === 'reduce' ? 'always' : motionPref === 'full' ? 'never' : 'user'}>
      <div className={idle && !overview ? 'stage-cursor-hidden' : ''} style={{ position: 'fixed', inset: 0 }}>
        <Stage>
          <AnimatePresence mode="popLayout" initial={false} custom={instant}>
            <motion.div
              key={scene.id}
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: instant ? 1 : 0, y: instant || reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: d(0.35), ease: easeInOut } }}
              exit={{ opacity: instant ? 1 : 0, transition: { duration: d(0.25) } }}
            >
              <SceneEnvCtx.Provider value={{ mode: 'live', reduced }}>
                <C step={nav.step} mode="live" />
              </SceneEnvCtx.Provider>
            </motion.div>
          </AnimatePresence>
        </Stage>
        <Presenter
          visible={chrome || overview || help}
          scenes={scenes}
          scene={nav.scene}
          step={nav.step}
          theme={theme}
          motionPref={motionPref}
          includeAppendix={includeAppendix}
          overview={overview}
          help={help}
          black={black}
          toast={toast}
          onGoto={(i) => {
            move(goto(i, steps))
            setOverview(false)
          }}
          onFullscreen={actions.fullscreen}
          onScene={(i) => move(goto(i, steps))}
          onTheme={actions.theme}
          onCloseOverlays={actions.escape}
        />
      </div>
    </MotionConfig>
  )
}
