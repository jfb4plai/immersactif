import { formatRef } from '../data/references'

// Shown right after the raw scene: the SAME situation with a simple accommodation,
// so the teacher feels the relief — the lever for self-efficacy ("je peux agir,
// et ça marche"), not just the distress.
export function AccommodationRelief({ scene, onContinue }) {
  const a = scene.accommodation
  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        La même situation, aménagée
      </p>
      <h2 className="text-lg font-semibold">{scene.title} — avec un aménagement simple</h2>

      <ul className="space-y-2">
        {a.changes.map((c, i) => (
          <li
            key={i}
            className="flex items-start gap-2 rounded-lg border-l-4 border-plai-teal bg-teal-50 p-3 read"
          >
            <span className="font-bold text-plai-teal" aria-hidden>
              ✓
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <p className="read rounded bg-slate-100 p-3">
        <strong>Résultat :</strong> {a.relief}
      </p>

      <p className="text-xs text-slate-500">Sources : {a.refs.map(formatRef).join(' · ')}</p>

      <button
        onClick={onContinue}
        className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white"
      >
        Continuer
      </button>
    </section>
  )
}
