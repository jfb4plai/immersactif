import { useState } from 'react'

// 3 routine items shown one-by-one → teacher clicks "Suivant →" in same position each time
// On 3rd click: rupture fires instead of next expected item (A)
// Rupture layout: scrambled schedule + "Terminer" link moved to top-left (C)

const DATA = {
  fondamental: {
    routine: ['Accueil', 'Lecture', 'Maths'],
    ruptureAlert:
      'La récréation est supprimée — réunion de coordination. Rejoignez immédiatement la salle B.',
    scrambled: [
      { label: 'Récréation', note: '(supprimée)' },
      { label: 'Maths', note: '(salle B — changement de local)' },
      { label: 'Lecture', note: '' },
      { label: 'Accueil', note: '' },
    ],
  },
  secondaire: {
    routine: ['Français — local 12', 'Maths — local 12', 'Sciences — local 12'],
    ruptureAlert:
      'Permanence déplacée au local B08. Enseignant remplaçant non confirmé. Départ immédiat.',
    scrambled: [
      { label: 'Sciences — local B08', note: '(à vérifier)' },
      { label: 'Permanence', note: '(local changé — voir affichage)' },
      { label: 'Maths — local 12', note: '' },
      { label: 'Français — salle info', note: '(?)' },
    ],
  },
}

export function UnforeseenScene({ level, onDone }) {
  const d = DATA[level]
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('routine')

  function advance() {
    if (step < d.routine.length - 1) {
      setStep((s) => s + 1)
    } else {
      setPhase('rupture')
    }
  }

  if (phase === 'routine') {
    return (
      <div className="space-y-4">
        <p className="read text-sm italic text-slate-500">
          Consultez le déroulé étape par étape — appuyez sur « Suivant » pour avancer.
        </p>
        <ol className="space-y-2">
          {d.routine.slice(0, step + 1).map((item, i) => (
            <li
              key={i}
              className={`read rounded border p-3 ${
                i === step
                  ? 'border-plai-teal bg-teal-50 font-semibold'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              <span className="mr-2 text-slate-400">{i + 1}.</span>
              {item}
            </li>
          ))}
          <li className="read rounded border border-dashed border-slate-200 p-3 text-slate-300">
            <span className="mr-2">{step + 2}.</span>…
          </li>
        </ol>
        {/* Always bottom-right — same position every click */}
        <div className="flex justify-end">
          <button
            onClick={advance}
            className="rounded-lg bg-plai-teal px-6 py-3 font-semibold text-white"
          >
            Suivant →
          </button>
        </div>
      </div>
    )
  }

  // Phase C: rupture + disoriented layout
  // Exit button is now top-left, text-style — opposite of where "Suivant →" was
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <button
          onClick={onDone}
          className="text-sm text-plai-teal underline underline-offset-2"
        >
          ↑ Terminer la scène
        </button>
      </div>

      <div className="rounded border border-red-300 bg-red-50 p-4">
        <p className="read font-semibold text-red-800">{d.ruptureAlert}</p>
      </div>

      <p className="read text-sm font-semibold text-slate-500">Emploi du temps mis à jour :</p>
      <ol className="space-y-2">
        {d.scrambled.map((item, i) => (
          <li key={i} className="read flex gap-2 rounded border border-slate-200 p-3">
            <span className="shrink-0 text-slate-400">{i + 1}.</span>
            <span>
              {item.label}
              {item.note && (
                <span className="ml-2 text-sm text-amber-700">{item.note}</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
