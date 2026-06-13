import { EnergyGauge } from './EnergyGauge'

export function SceneShell({ title, energy, onExit, children }) {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <header className="mb-4 flex items-center justify-between gap-4 border-b pb-3">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex items-center gap-4">
          <EnergyGauge energy={energy} />
          <button
            onClick={onExit}
            className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
          >
            Sortir de la scène
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
