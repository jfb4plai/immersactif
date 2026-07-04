import { useState } from 'react'
import { CONTEXT_ITEMS } from '../../data/contextItems'

// Deux temps par extrait : (1) l'extrait seul + 3 questions auxquelles on répond
// « à chaud » (la réponse spontanée sera probablement fausse), puis (2) le contexte
// qui renverse la première lecture. Les réponses saisies restent locales et ne sont
// pas stockées : leur seul rôle est de forcer l'engagement avant la révélation.
export function ContextScene({ level, onDone }) {
  const items = CONTEXT_ITEMS[level]
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState({})
  const item = items[idx]
  const last = idx + 1 >= items.length

  function next() {
    if (!last) {
      setIdx(idx + 1)
      setRevealed(false)
      setAnswers({})
    } else {
      onDone()
    }
  }

  return (
    <div className="space-y-4 read">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Extrait d'un livre pour enfants ({idx + 1}/{items.length})
      </p>

      <blockquote className="space-y-1 rounded-lg border-l-4 border-slate-300 bg-slate-50 p-3">
        {item.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </blockquote>

      {!revealed ? (
        <div className="space-y-3">
          <p className="font-medium">
            Sans en savoir plus, répondez — notez la première réponse qui vient :
          </p>
          <ol className="space-y-3">
            {item.questions.map((qq, i) => (
              <li key={i} className="space-y-1">
                <label className="block font-medium" htmlFor={`ctx-q${i}`}>
                  {i + 1}. {qq.q}
                </label>
                <input
                  id={`ctx-q${i}`}
                  type="text"
                  aria-label={qq.q}
                  value={answers[i] || ''}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                  placeholder="Votre réponse…"
                  className="w-full rounded border border-slate-300 p-2 read"
                />
              </li>
            ))}
          </ol>
          <button
            onClick={() => setRevealed(true)}
            className="rounded-lg border border-plai-teal px-4 py-2 font-semibold text-plai-teal"
          >
            Découvrir le contexte
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border-l-4 border-plai-teal bg-teal-50 p-3">
            <p className="text-xs font-semibold uppercase text-plai-teal">Le contexte</p>
            <p className="mt-1">{item.context}</p>
          </div>
          <p className="font-medium">Vos réponses se tenaient — mais le contexte les renverse :</p>
          <ul className="space-y-2">
            {item.questions.map((qq, i) => (
              <li key={i} className="space-y-1 rounded border border-slate-200 p-3">
                <p className="font-medium">{qq.q}</p>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold">Sans contexte :</span> {qq.spontaneous}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-plai-teal">Avec le contexte :</span> {qq.real}
                </p>
              </li>
            ))}
          </ul>
          <button onClick={next} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
            {last ? 'Terminer la scène' : 'Extrait suivant'}
          </button>
        </div>
      )}
    </div>
  )
}
