import { useState } from 'react'
import { useAppState } from './state/AppStateContext'
import { EntryScreen } from './components/EntryScreen'
import { Hub } from './components/Hub'
import { SceneShell } from './components/SceneShell'
import { MicroDebrief } from './components/MicroDebrief'
import { SynthesisSheet } from './components/SynthesisSheet'
import { SocialPanel } from './components/SocialPanel'
import { SensoryScene } from './components/scenes/SensoryScene'
import { ImplicitScene } from './components/scenes/ImplicitScene'
import { UnforeseenScene } from './components/scenes/UnforeseenScene'
import { SCENES } from './data/scenes'
import { GESTURES } from './data/gestures'
import { SCENE_DRAIN } from './lib/energy'
import { nextNarrativeScene } from './lib/hub'

const SCENE_COMPONENTS = {
  sensory: SensoryScene,
  implicit: ImplicitScene,
  unforeseen: UnforeseenScene,
}

export default function App() {
  const { state, dispatch } = useAppState()
  const [view, setView] = useState('entry')
  const [activeScene, setActiveScene] = useState(null)

  if (!state.consentEthics || view === 'entry') {
    return (
      <EntryScreen
        onStart={({ level, mode }) => {
          dispatch({ type: 'ACK_ETHICS' })
          dispatch({ type: 'SET_LEVEL', level })
          dispatch({ type: 'SET_MODE', mode })
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
    if (id === 'synthesis') return setView('synthesis')
    setActiveScene(id)
    setView('scene')
  }

  function finishScene() {
    dispatch({ type: 'DRAIN_ENERGY', amount: SCENE_DRAIN[activeScene] })
    setView('debrief')
  }

  function afterDebrief() {
    dispatch({ type: 'COMPLETE_SCENE', scene: activeScene })
    if (state.mode === 'animateur') return setView('hub')
    const completed = [...new Set([...state.completedScenes, activeScene])]
    const next = nextNarrativeScene(completed)
    if (next) {
      setActiveScene(next)
      setView('scene')
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

  if (view === 'closing') {
    return (
      <main className="mx-auto max-w-2xl space-y-4 p-6 text-center">
        <h2 className="text-xl font-semibold">Il vous reste l'après-midi.</h2>
        <p className="read text-slate-600">
          L'élève, lui, recommencera demain. Vous pouvez maintenant revisiter chaque scène et
          composer votre fiche de gestes.
        </p>
        <button onClick={() => setView('hub')} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Accéder au parcours
        </button>
      </main>
    )
  }

  if (view === 'social') return <SocialPanel onBack={() => setView('hub')} />

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
