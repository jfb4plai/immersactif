import { useState } from 'react'
import { useAppState } from './state/AppStateContext'
import { EntryScreen } from './components/EntryScreen'
import { Hub } from './components/Hub'
import { SceneShell } from './components/SceneShell'
import { MicroDebrief } from './components/MicroDebrief'
import { AccommodationRelief } from './components/AccommodationRelief'
import { SynthesisSheet } from './components/SynthesisSheet'
import { SocialPanel } from './components/SocialPanel'
import { StudentVoices } from './components/StudentVoices'
import { LimitsPanel } from './components/LimitsPanel'
import { SensoryScene } from './components/scenes/SensoryScene'
import { ImplicitScene } from './components/scenes/ImplicitScene'
import { UnforeseenScene } from './components/scenes/UnforeseenScene'
import { EnergyGauge } from './components/EnergyGauge'
import { SCENES } from './data/scenes'
import { GESTURES } from './data/gestures'
import { SCENE_DRAIN } from './lib/energy'
import { nextNarrativeScene, SCENE_ORDER } from './lib/hub'

const SCENE_COMPONENTS = {
  sensory: SensoryScene,
  implicit: ImplicitScene,
  unforeseen: UnforeseenScene,
}

export default function App() {
  const { state, dispatch } = useAppState()
  const [view, setView] = useState('entry')
  const [activeScene, setActiveScene] = useState(null)
  const [nextScene, setNextScene] = useState(null)

  if (!state.consentEthics || view === 'entry') {
    return (
      <EntryScreen
        onStart={({ level, mode }) => {
          dispatch({ type: 'ACK_ETHICS' })
          dispatch({ type: 'SET_LEVEL', level })
          dispatch({ type: 'SET_MODE', mode })
          dispatch({ type: 'RESET_RUN' }) // fresh matinée: energy back to 100, progress cleared
          if (mode === 'animateur') {
            setView('hub')
          } else {
            setActiveScene('sensory')
            setView('scene')
          }
        }}
      />
    )
  }

  function openScene(id) {
    if (id === 'social') return setView('social')
    if (id === 'voices') return setView('voices')
    if (id === 'limits') return setView('limits')
    if (id === 'synthesis') return setView('synthesis')
    // Replaying a single scene from the hub: start it on a full gauge so the
    // drop is legible again (the sequential Découverte run keeps its cumul).
    dispatch({ type: 'RESET_ENERGY' })
    setActiveScene(id)
    setView('scene')
  }

  function finishScene() {
    dispatch({ type: 'DRAIN_ENERGY', amount: SCENE_DRAIN[activeScene] })
    setView('relief') // show the same situation accommodated, then debrief
  }

  function afterDebrief() {
    dispatch({ type: 'COMPLETE_SCENE', scene: activeScene })
    if (state.mode === 'animateur') return setView('hub')
    const completed = [...new Set([...state.completedScenes, activeScene])]
    const next = nextNarrativeScene(completed)
    if (next) {
      // Découverte: explicit transition (recap of what was done + what comes next)
      setNextScene(next)
      setView('transition')
    } else {
      setView('closing')
    }
  }

  if (view === 'scene') {
    const SceneComp = SCENE_COMPONENTS[activeScene]
    return (
      <SceneShell
        title={SCENES[activeScene].title}
        energy={state.energy}
        onExit={() => setView(state.mode === 'animateur' ? 'hub' : 'closing')}
      >
        <SceneComp level={state.level} onDone={finishScene} />
      </SceneShell>
    )
  }

  if (view === 'relief') {
    return (
      <AccommodationRelief scene={SCENES[activeScene]} onContinue={() => setView('debrief')} />
    )
  }

  if (view === 'debrief') {
    const sceneGestures = GESTURES[activeScene][state.level]
    return (
      <MicroDebrief
        scene={SCENES[activeScene]}
        gestures={sceneGestures}
        selected={state.selectedGestures}
        onToggle={(g) => dispatch({ type: 'TOGGLE_GESTURE', id: g.id, label: g.label })}
        onContinue={afterDebrief}
      />
    )
  }

  if (view === 'transition') {
    const fromIndex = SCENE_ORDER.indexOf(activeScene)
    const toIndex = SCENE_ORDER.indexOf(nextScene)
    return (
      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Situation {fromIndex + 1} sur {SCENE_ORDER.length} — terminée
          </p>
          <h2 className="text-lg font-semibold">Vous venez de vivre : {SCENES[activeScene].title}</h2>
          <p className="read text-slate-600">{SCENES[activeScene].recap}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
          <p className="text-sm text-slate-600">
            Votre énergie continue de baisser, et elle ne remonte pas — comme au fil d'une vraie matinée :
          </p>
          <EnergyGauge energy={state.energy} />
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Prochaine situation ({toIndex + 1} sur {SCENE_ORDER.length}) :
          </p>
          <p className="text-lg font-semibold text-plai-teal">{SCENES[nextScene].title}</p>
          <button
            onClick={() => { setActiveScene(nextScene); setView('scene') }}
            className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white"
          >
            Continuer
          </button>
        </div>
      </main>
    )
  }

  if (view === 'closing') {
    return (
      <main className="mx-auto max-w-2xl space-y-4 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Les trois situations sont terminées
        </p>
        <h2 className="text-xl font-semibold">Il vous reste l'après-midi.</h2>
        <p className="read text-slate-600">
          Vous avez traversé le bruit, l'implicite et l'imprévu — et votre énergie ne reviendra pas
          à 100&nbsp;%. L'élève, lui, recommencera demain. Vous pouvez maintenant revisiter chaque
          scène et composer votre fiche de gestes.
        </p>
        <div className="mx-auto max-w-xs"><EnergyGauge energy={state.energy} /></div>
        <button onClick={() => setView('hub')} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Accéder au parcours
        </button>
      </main>
    )
  }

  if (view === 'social') return <SocialPanel onBack={() => setView('hub')} />

  if (view === 'voices') return <StudentVoices onBack={() => setView('hub')} />

  if (view === 'limits') return <LimitsPanel onBack={() => setView('hub')} />

  if (view === 'synthesis') {
    return (
      <div className="space-y-4 p-2">
        <SynthesisSheet
          selectedGestures={state.selectedGestures}
          onPersonalize={(id, text) => dispatch({ type: 'SET_PERSONALIZATION', id, text })}
        />
        <div className="mx-auto max-w-3xl px-4">
          <button onClick={() => setView('hub')} className="rounded border border-slate-300 px-4 py-2">Retour au parcours</button>
        </div>
      </div>
    )
  }

  return <Hub completedScenes={state.completedScenes} onOpen={openScene} />
}
