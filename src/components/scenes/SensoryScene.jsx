import { useEffect, useRef, useState } from 'react'
import { useAudioLayers } from '../../audio/useAudioLayers'

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SPEECH_OK = typeof window !== 'undefined' && 'speechSynthesis' in window

// Noise never starts in silence (otherwise the first instruction is heard perfectly
// and the exercise loses its point). 0.6 = the room is already loud when step 1 is said.
// Tune this single value if it feels too masked (lower) or too clear (higher).
const START_INTENSITY = 0.6
const DURATION = 20000

// A real multi-step oral consigne: each step is a single action verb. The steps are
// timed onto the rising-noise curve, so step 1 lands at the floor (catchable) and the
// last step lands near full intensity (likely buried) — the lived "I missed the end".
const CONSIGNE = {
  fondamental: [
    'Entoure le chat en rouge.',
    'Souligne le mot « école ».',
    "Colorie l'étoile en bleu, puis lève la main.",
  ],
  secondaire: [
    'Note la date dans la marge.',
    'Souligne le titre du document.',
    'Réponds à la question trois, puis rends ta feuille.',
  ],
}

// When each step is spoken, as a fraction of DURATION (so it maps onto the intensity curve).
const STEP_OFFSETS = [0.06, 0.42, 0.78]

function speak(text) {
  if (!SPEECH_OK) return
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'
    const fr = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith('fr'))
    if (fr) u.voice = fr
    u.rate = 0.95
    u.volume = 1 // constant volume: the rising noise is what masks it, not a fade
    window.speechSynthesis.speak(u)
  } catch {
    /* speech unavailable at runtime: silent */
  }
}

export function SensoryScene({ level, onDone }) {
  const audio = useAudioLayers()
  const [started, setStarted] = useState(false)
  const [intensity, setIntensity] = useState(START_INTENSITY)
  const reduced = REDUCED()
  const raf = useRef(null)
  const t0 = useRef(0)
  const timers = useRef([])

  const steps = CONSIGNE[level]

  function stopSpeech() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (SPEECH_OK) {
      try { window.speechSynthesis.cancel() } catch { /* noop */ }
    }
  }

  useEffect(() => {
    if (!started || reduced) return
    t0.current = performance.now()

    // Schedule each step once, at its point on the rising-noise curve.
    timers.current = steps.map((line, i) =>
      setTimeout(() => speak(line), STEP_OFFSETS[i] * DURATION)
    )

    const tick = (now) => {
      const p = Math.min(1, (now - t0.current) / DURATION)
      const level = START_INTENSITY + (1 - START_INTENSITY) * p // floor -> 1
      setIntensity(level)
      audio.setIntensity(level)
      if (p < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        stopSpeech()
      }
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      stopSpeech()
    }
  }, [started, reduced, audio, steps])

  async function begin() {
    if (!reduced) await audio.init()
    setStarted(true)
  }

  function finish() {
    stopSpeech()
    audio.stop()
    onDone()
  }

  if (!started) {
    return (
      <div className="space-y-4">
        <p className="read">
          Une consigne en trois étapes va vous être donnée à voix haute. Essayez de la suivre
          entièrement.
        </p>
        <p className="text-sm text-amber-700">
          {SPEECH_OK
            ? '⚠ Cette scène comporte du son et une consigne dite à voix haute. Réglez votre volume.'
            : '⚠ Cette scène comporte du son. Réglez votre volume.'}
        </p>
        <button onClick={begin} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Entrer dans la scène
        </button>
      </div>
    )
  }

  if (reduced) {
    return (
      <div className="space-y-4 read">
        <p>
          Imaginez : une consigne en trois étapes vous est donnée à voix haute —
          « {steps[0]} {steps[1]} {steps[2]} » — mais pendant que vous tentez de la suivre, les
          chaises raclent, des voix chuchotent, un néon grésille, le couloir résonne, une sonnerie
          retentit. Le bruit, déjà fort, monte encore : la première étape passe, mais la dernière
          se noie complètement. La tâche, simple au départ, devient presque impossible.
        </p>
        <button onClick={finish} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Terminer la scène
        </button>
      </div>
    )
  }

  const done = intensity >= 1
  const blur = (intensity * 3).toFixed(1)
  return (
    <div className="relative space-y-4">
      {SPEECH_OK ? (
        <p className="read" style={{ filter: `blur(${blur}px)` }}>
          Écoutez la consigne et faites ce qu'elle demande…
        </p>
      ) : (
        // No speech synthesis available: fall back to the written steps.
        <ol className="read list-decimal pl-6" style={{ filter: `blur(${blur}px)` }}>
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-slate-900"
        style={{ opacity: intensity * 0.25 }}
      />
      <p className="text-sm text-slate-500">Intensité : {Math.round(intensity * 100)}%</p>

      {done && (
        <div className="relative space-y-3">
          <div className="read rounded bg-slate-100 p-3">
            <p className="font-semibold">La consigne était :</p>
            <ol className="list-decimal pl-6">
              {steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <p className="mt-2">Avez-vous capté les trois étapes — surtout la dernière ?</p>
          </div>
          <button onClick={finish} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
            Terminer la scène
          </button>
        </div>
      )}
    </div>
  )
}
