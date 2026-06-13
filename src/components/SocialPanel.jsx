import { SOCIAL_CARDS } from '../data/socialCards'
import { formatRef } from '../data/references'
import { EthicalBanner } from './EthicalBanner'

export function SocialPanel({ onBack }) {
  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-xl font-semibold">Et les interactions sociales ?</h2>
      <p className="read text-slate-600">
        Ce volet ne se simule pas : nous le présentons en lecture, pour éviter toute caricature.
      </p>
      <EthicalBanner compact />
      <div className="grid gap-3">
        {SOCIAL_CARDS.map((c, i) => (
          <article key={i} className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="read mt-1">{c.body}</p>
            <p className="mt-2 text-xs text-slate-500">Source : {formatRef(c.ref)}</p>
          </article>
        ))}
      </div>
      <button onClick={onBack} className="rounded-lg border border-slate-300 px-4 py-2">Retour</button>
    </section>
  )
}
