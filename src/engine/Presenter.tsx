import type { CSSProperties } from 'react'
import type { SceneDef } from '../content/scenes'
import type { MotionPref } from './motion'
import { SceneEnvCtx } from './motion'

const font: CSSProperties = { fontFamily: "'Hanken Grotesk Variable', system-ui, sans-serif" }
const panel: CSSProperties = {
  position: 'fixed', inset: 0, background: 'var(--bg)',
  zIndex: 30, overflow: 'auto', touchAction: 'pan-y', padding: 32, color: 'var(--ink)', ...font,
}

export interface ChromeProps {
  visible: boolean
  scenes: SceneDef[]
  scene: number
  step: number
  theme: string
  motionPref: MotionPref
  includeAppendix: boolean
  overview: boolean
  help: boolean
  black: boolean
  toast: string | null
  onGoto(i: number): void
  onFullscreen(): void
  onScene(i: number): void
  onTheme(): void
  onCloseOverlays(): void
}

export function Presenter(p: ChromeProps) {
  const cur = p.scenes[p.scene]
  return (
    <>
      {p.black && <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 50 }} />}
      {p.overview && (
        <div style={panel} role="dialog" aria-label="Scene overview">
          <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>Overview</h2>
            <span style={{ color: 'var(--muted)', fontSize: 16 }}>
              Click a scene to jump. A: appendix {p.includeAppendix ? 'on' : 'off'} · Esc: close
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {p.scenes.map((s, i) => {
              const C = s.Component
              const k = 280 / 1920
              return (
                <button
                  key={s.id}
                  onClick={() => p.onGoto(i)}
                  style={{
                    all: 'unset', cursor: 'pointer', display: 'block',
                    outline: i === p.scene ? '3px solid var(--cobalt)' : '1px solid var(--hair)',
                    outlineOffset: 2, ...font,
                  }}
                >
                  <div style={{ width: 280, height: 1080 * k, overflow: 'hidden', position: 'relative', background: 'var(--bg)' }}>
                    <div style={{ width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0', position: 'absolute' }}>
                      <SceneEnvCtx.Provider value={{ mode: 'print', reduced: true }}>
                        <C step={s.printStep ?? s.steps - 1} mode="print" />
                      </SceneEnvCtx.Provider>
                    </div>
                  </div>
                  <div style={{ fontSize: 15, marginTop: 6, color: 'var(--ink-2)' }}>{i + 1}. {s.title}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      {p.help && (
        <div style={{ ...panel, display: 'grid', placeItems: 'center' }} role="dialog" aria-label="Keyboard help">
          <table style={{ fontSize: 20, lineHeight: 1.7, borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['→  Space  PgDn  ↓', 'Next reveal'],
                ['←  PgUp  ↑', 'Previous reveal'],
                ['Home / End', 'First / last scene'],
                ['Shift + → / ←  or  ] / [', 'Next / previous scene'],
                ['Drag the bottom slider', 'Scrub through scenes'],
                ['O', 'Overview'],
                ['F', 'Fullscreen'],
                ['T', `Theme (${p.theme})`],
                ['M', `Motion (${p.motionPref})`],
                ['B', 'Black screen'],
                ['P', 'Export PDF'],
                ['R R', 'Restart'],
                ['Esc', 'Close panels'],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ paddingRight: 40, color: 'var(--cobalt)', fontFamily: "'DM Mono', monospace" }}>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, padding: '10px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15,
          background: 'color-mix(in srgb, var(--bg) 88%, transparent)', color: 'var(--ink-2)',
          opacity: p.visible ? 1 : 0, transition: 'opacity .25s', pointerEvents: p.visible ? 'auto' : 'none', ...font,
        }}
      >
        <span style={{ whiteSpace: 'nowrap', minWidth: 300 }}>
          {p.scene + 1} / {p.scenes.length}: {cur.title} (step {p.step + 1} of {cur.steps})
        </span>
        <input
          type="range"
          min={0}
          max={p.scenes.length - 1}
          step={1}
          value={p.scene}
          onChange={(e) => p.onScene(Number(e.target.value))}
          onPointerUp={(e) => e.currentTarget.blur()}
          aria-label="Jump to scene"
          title={cur.title}
          style={{ flex: 1, margin: '0 24px', accentColor: 'var(--cobalt)', cursor: 'pointer' }}
        />
        <span style={{ display: 'flex', gap: 8 }}>
          <button onClick={p.onTheme} style={btn} aria-label="Toggle light or dark theme">{p.theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
          <button onClick={p.onFullscreen} style={btn}>Fullscreen</button>
          <button onClick={p.onCloseOverlays} style={btn} aria-label="Close panels">Esc</button>
        </span>
      </div>
      {p.toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--bg)', padding: '8px 16px', borderRadius: 6, fontSize: 16, zIndex: 40, ...font }}>
          {p.toast}
        </div>
      )}
    </>
  )
}

const btn: CSSProperties = {
  font: 'inherit', color: 'var(--ink)', background: 'transparent',
  border: '1px solid var(--hair)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
}
