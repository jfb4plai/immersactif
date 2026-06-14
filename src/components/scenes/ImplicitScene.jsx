import { useState } from 'react'
import { IMPLICIT_ITEMS } from '../../data/implicitItems'

export function ImplicitScene({ level, onDone }) {
  const items = IMPLICIT_ITEMS[level]
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const item = items[idx]
  const last = idx + 1 >= items.length

  function next() {
    if (!last) {
      setIdx(idx + 1)
      setRevealed(false)
    } else {
      onDone()
    }
  }

  return (
    <div className="space-y-4 read">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Consigne dite en classe ({idx + 1}/{items.length})
      </p>
      <p className="text-lg font-semibold">{item.instruction}</p>

      <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3">
        <p className="text-xs font-semibold uppercase text-amber-700">Réaction de l'élève</p>
        <p className="mt-1">{item.reaction}</p>
      </div>

      {!revealed ? (
        <div className="space-y-3">
          <p className="font-medium">
            Pourquoi l'élève a-t-il réagi ainsi ? Formulez votre hypothèse, puis révélez.
          </p>
          <button
            onClick={() => setRevealed(true)}
            className="rounded-lg border border-plai-teal px-4 py-2 font-semibold text-plai-teal"
          >
            Révéler le double sens
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="rounded bg-slate-100 p-3">{item.why}</p>
          <button onClick={next} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
            {last ? 'Terminer la scène' : 'Situation suivante'}
          </button>
        </div>
      )}
    </div>
  )
}
