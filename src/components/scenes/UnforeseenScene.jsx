import { useState } from 'react'

const SCHEDULE = {
  fondamental: ['Accueil', 'Lecture', 'Maths', 'Récréation'],
  secondaire: ['Français (local 12)', 'Maths (local 12)', 'Sciences (local 12)'],
}

export function UnforeseenScene({ level, onDone }) {
  const steps = SCHEDULE[level]
  const [phase, setPhase] = useState('routine')
  const [guess, setGuess] = useState(null)

  if (phase === 'routine') {
    return (
      <div className="space-y-4 read">
        <p>Voici le déroulé prévu. Appuyez-vous dessus, comme un repère stable.</p>
        <ol className="space-y-1">
          {steps.map((s, i) => (
            <li key={i} className="rounded border border-slate-200 p-2">{i + 1}. {s}</li>
          ))}
        </ol>
        <button onClick={() => setPhase('predict')} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Et après la prochaine étape ?
        </button>
      </div>
    )
  }

  if (phase === 'predict') {
    return (
      <div className="space-y-4 read">
        <p>Que va-t-il se passer ensuite, d'après le déroulé ?</p>
        <div className="grid gap-2">
          {steps.slice(1).map((s, i) => (
            <button
              key={i}
              onClick={() => { setGuess(s); setPhase('rupture') }}
              className="rounded-lg border border-slate-300 px-4 py-3 text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 read">
      <p className="rounded bg-red-50 p-3">
        Changement : enseignant remplaçant, et le cours a lieu dans un autre local. Votre
        prévision (« {guess} ») ne tient plus. Le repère sur lequel vous comptiez a disparu.
      </p>
      <button onClick={onDone} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
        Terminer la scène
      </button>
    </div>
  )
}
