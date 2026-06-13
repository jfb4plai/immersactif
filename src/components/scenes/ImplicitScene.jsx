import { useState } from 'react'
import { IMPLICIT_ITEMS } from '../../data/implicitItems'

export function ImplicitScene({ level, onDone }) {
  const items = IMPLICIT_ITEMS[level]
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const item = items[idx]

  function next() {
    if (idx + 1 < items.length) {
      setIdx(idx + 1)
      setRevealed(false)
    } else {
      onDone()
    }
  }

  return (
    <div className="space-y-4 read">
      <p className="text-lg font-semibold">{item.instruction}</p>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="rounded-lg border border-slate-300 px-4 py-3 text-left"
        >
          {item.literal}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="rounded bg-red-50 p-3">
            On vous reprend : ce n'était pas l'attendu. <strong>{item.expected}</strong>
          </p>
          <p className="text-slate-600">{item.reframe}</p>
          <button onClick={next} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
            {idx + 1 < items.length ? 'Situation suivante' : 'Terminer la scène'}
          </button>
        </div>
      )}
    </div>
  )
}
