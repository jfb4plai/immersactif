import { useState } from 'react'
import { EthicalBanner } from './EthicalBanner'
import { LimitsPanel } from './LimitsPanel'

function Choice({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-lg border px-4 py-3 text-left ${
        selected ? 'border-plai-teal bg-teal-50 ring-2 ring-plai-teal' : 'border-slate-300'
      }`}
    >
      {label}
    </button>
  )
}

export function EntryScreen({ onStart }) {
  const [level, setLevel] = useState(null)
  const [mode, setMode] = useState(null)
  const [showLimits, setShowLimits] = useState(false)
  const canStart = level && mode

  if (showLimits) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <LimitsPanel onBack={() => setShowLimits(false)} />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-plai-teal">ImmersActif</h1>
      <EthicalBanner />
      <button
        onClick={() => setShowLimits(true)}
        className="text-sm text-slate-500 underline underline-offset-2 hover:text-plai-teal"
      >
        Ce que cet outil ne fait pas
      </button>

      <section className="space-y-2">
        <h2 className="font-semibold">Votre niveau</h2>
        <div className="grid grid-cols-2 gap-3">
          <Choice label="Fondamental" selected={level === 'fondamental'} onClick={() => setLevel('fondamental')} />
          <Choice label="Secondaire" selected={level === 'secondaire'} onClick={() => setLevel('secondaire')} />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Votre mode</h2>
        <div className="grid grid-cols-1 gap-3">
          <Choice
            label="Découverte — vivre une matinée complète, puis accéder aux scènes"
            selected={mode === 'decouverte'}
            onClick={() => setMode('decouverte')}
          />
          <Choice
            label="Animateur — accès direct aux scènes (formation)"
            selected={mode === 'animateur'}
            onClick={() => setMode('animateur')}
          />
        </div>
      </section>

      <button
        disabled={!canStart}
        onClick={() => onStart({ level, mode })}
        className="w-full rounded-lg bg-plai-teal py-3 font-semibold text-white disabled:opacity-40"
      >
        Commencer
      </button>
    </main>
  )
}
