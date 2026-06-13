import { energyBand } from '../lib/energy'

export function EnergyGauge({ energy }) {
  const band = energyBand(energy)
  return (
    <div className="flex items-center gap-2" aria-label={`Énergie : ${energy}%, ${band.label}`}>
      <span className="text-xs text-slate-500">Énergie</span>
      <div className="h-3 w-32 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${band.color} transition-all`} style={{ width: `${energy}%` }} />
      </div>
      <span className="text-xs font-medium">{energy}% · {band.label}</span>
    </div>
  )
}
