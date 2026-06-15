import { buildSheet, canPrint } from '../lib/synthesis'
import { REFERENCES } from '../data/references'

export function SynthesisSheet({ selectedGestures, onPersonalize }) {
  const sheet = buildSheet(selectedGestures)
  const printable = canPrint(selectedGestures)

  if (sheet.items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl p-4">
        <p className="read text-slate-600">
          Aucun geste sélectionné. Cochez des gestes pendant les scènes pour construire votre fiche.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-xl font-semibold">Ma fiche — gestes pour ma classe</h2>
      <p className="read text-slate-600">
        L'outil propose ; vous décidez. Pour au moins un geste, dites comment vous l'appliquerez —
        quand, pour quel élève, concrètement — avant d'imprimer.
      </p>

      <div id="synthesis-print" className="space-y-4">
        <h1 className="text-lg font-bold">ImmersActif — gestes retenus</h1>
        {sheet.items.map((it) => (
          <div key={it.id} className="rounded-lg border border-slate-200 p-3">
            <p className="font-medium read">{it.label}</p>
            <label className="mt-2 block text-sm">
              <span className="text-slate-600">
                Mon engagement — cette semaine, dans ma classe : quand ? pour qui ? comment ?
              </span>
              <textarea
                value={it.personalization}
                onChange={(e) => onPersonalize(it.id, e.target.value)}
                placeholder="Ex. : dès lundi, pour [code élève], j'affiche la consigne au tableau avant de la dire."
                className="mt-1 w-full rounded border border-slate-300 p-2 read"
                rows={2}
              />
            </label>
          </div>
        ))}
        <p className="text-xs text-slate-500">
          Cette expérience approche certains mécanismes, elle ne reproduit pas le vécu réel.
          Sources : {Object.values(REFERENCES).map((r) => `${r.authors} ${r.year}`).join(' · ')}
        </p>
      </div>

      <button
        disabled={!printable}
        onClick={() => window.print()}
        className="rounded-lg bg-plai-orange px-4 py-2 font-semibold text-white disabled:opacity-40"
      >
        Imprimer ma fiche
      </button>
      {!printable && (
        <p className="text-sm text-amber-700">Reformulez au moins un geste pour activer l'impression.</p>
      )}
    </section>
  )
}
