import { formatRef } from '../data/references'

export function MicroDebrief({ scene, gestures, selected, onToggle, onContinue }) {
  return (
    <section className="mx-auto max-w-3xl space-y-5 p-4">
      <div className="space-y-3 read">
        <div>
          <p className="text-xs font-semibold uppercase text-plai-teal">Ce que vous venez de vivre</p>
          <p>{scene.debrief.lived}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-plai-teal">Ce que vit l'élève</p>
          <p>{scene.debrief.student}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-plai-teal">Ce que vous pouvez ajuster</p>
          <p>{scene.debrief.adjust}</p>
        </div>
      </div>

      {scene.nuance && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 read">
          <p className="text-xs font-semibold uppercase text-amber-700">À nuancer</p>
          <p className="mt-1">{scene.nuance}</p>
        </div>
      )}

      <p className="font-medium read">
        Cochez le ou les gestes que vous vous engagez à essayer cette semaine :
      </p>
      <fieldset className="space-y-2">
        <legend className="sr-only">Gestes à retenir</legend>
        {gestures.map((g) => (
          <label key={g.id} className="flex items-start gap-2 rounded border border-slate-200 p-2">
            <input
              type="checkbox"
              aria-label={g.label}
              checked={!!selected[g.id]}
              onChange={() => onToggle(g)}
              className="mt-1"
            />
            <span className="read">{g.label}</span>
          </label>
        ))}
      </fieldset>

      <p className="text-xs text-slate-500">
        Sources : {scene.refs.map(formatRef).join(' · ')}
      </p>

      <button onClick={onContinue} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
        Continuer
      </button>
    </section>
  )
}
