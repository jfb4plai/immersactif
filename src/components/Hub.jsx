import { SCENES } from '../data/scenes'
import { SCENE_ORDER } from '../lib/hub'

export function Hub({ completedScenes, onOpen }) {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <h1 className="text-2xl font-bold text-plai-teal">Parcours</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {SCENE_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => onOpen(id)}
            className="rounded-lg border border-slate-200 p-4 text-left hover:border-plai-teal"
          >
            <span className="block font-semibold">{SCENES[id].title}</span>
            {completedScenes.includes(id) && <span className="text-xs text-plai-teal">✓ vu</span>}
          </button>
        ))}
      </div>

      <button
        onClick={() => onOpen('social')}
        className="w-full rounded-lg border-2 border-dashed border-slate-300 p-4 text-left"
      >
        <span className="block font-semibold">Et les interactions sociales ?</span>
        <span className="text-xs text-slate-500">Lecture — non simulé</span>
      </button>

      <button onClick={() => onOpen('synthesis')} className="w-full rounded-lg bg-plai-orange p-4 font-semibold text-white">
        Ma fiche de gestes
      </button>
    </main>
  )
}
