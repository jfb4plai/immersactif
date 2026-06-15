import { STUDENT_VOICES } from '../data/studentVoices'
import { formatRef } from '../data/references'

export function StudentVoices({ onBack }) {
  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-xl font-semibold">Paroles d'élèves</h2>
      <p className="read text-slate-600">
        Synthèses issues de la recherche — <strong>pas des citations d'élèves réels</strong>. Le but :
        recentrer sur le vécu de l'élève, sans parler à sa place.
      </p>
      <div className="grid gap-3">
        {STUDENT_VOICES.map((v, i) => (
          <article key={i} className="rounded-lg border-l-4 border-plai-teal bg-teal-50 p-4">
            <p className="read">{v.text}</p>
            <p className="mt-2 text-xs text-slate-500">Sources : {v.refs.map(formatRef).join(' · ')}</p>
          </article>
        ))}
      </div>
      <button onClick={onBack} className="rounded-lg border border-slate-300 px-4 py-2">
        Retour
      </button>
    </section>
  )
}
