import { useEffect, useState } from 'react'
import type { SceneDef } from '../content/scenes'
import { notes, qaNotes } from '../content/notes'
import { SceneEnvCtx } from './motion'
import { STAGE_H, STAGE_W } from './Stage'

function PrintScene({ s }: { s: SceneDef }) {
  const C = s.Component
  return (
    <SceneEnvCtx.Provider value={{ mode: 'print', reduced: true }}>
      <C step={s.printStep ?? s.steps - 1} mode="print" />
    </SceneEnvCtx.Provider>
  )
}

export function PrintView({ scenes, withNotes }: { scenes: SceneDef[]; withNotes: boolean }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return
          setReady(true)
          if (new URLSearchParams(location.search).has('autoprint')) window.print()
        }),
      ),
    )
    return () => {
      cancelled = true
    }
  }, [])
  const k = 0.6
  return (
    <div data-ready={ready ? 'true' : 'false'} className="print-root">
      {scenes.map((s) => (
        <section
          key={s.id}
          className="print-page"
          style={{ width: STAGE_W, height: STAGE_H }}
        >
          {withNotes ? (
            <>
              <div style={{ width: STAGE_W * k, height: STAGE_H * k, position: 'relative', overflow: 'hidden', margin: '48px 0 0 48px' }}>
                <div style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${k})`, transformOrigin: '0 0', position: 'absolute' }}>
                  <PrintScene s={s} />
                </div>
              </div>
              <p style={{ font: '500 28px/1.4 var(--font-sans, inherit)', margin: '32px 48px', maxWidth: 1600 }}>
                <strong>{s.title}</strong> · {s.targetSeconds}s
                <br />
                {notes[s.id] ?? ''}
              </p>
            </>
          ) : (
            <PrintScene s={s} />
          )}
        </section>
      ))}
      {withNotes && qaNotes.length > 0 && (
        <section className="print-page" style={{ width: STAGE_W, height: STAGE_H, padding: 96 }}>
          <h1>Q&amp;A prep</h1>
          {qaNotes.map((q) => (
            <p key={q} style={{ fontSize: 28, lineHeight: 1.4 }}>{q}</p>
          ))}
        </section>
      )}
    </div>
  )
}
