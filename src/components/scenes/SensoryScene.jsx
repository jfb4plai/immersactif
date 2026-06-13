import { useEffect, useRef, useState } from 'react'
import { useAudioLayers } from '../../audio/useAudioLayers'

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SPEECH_OK = typeof window !== 'undefined' && 'speechSynthesis' in window

// The actual spoken instruction the user must try to catch through the noise.
const CONSIGNE = {
  fondamental: 'Entoure le chat, puis colorie l’étoile en bleu.',
  secondaire: 'Note la date, souligne le titre, puis réponds à la question trois.',
}

function speakConsigne(text) {
  if (!SPEECH_OK) return
  try {
    window.speechSynthesis.cancel() // avoid queue pile-up
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
  const [intensity, setIntensity] = useState(0)
  const reduced = REDUCED()
  const raf = useRef(null)
  const t0 = useRef(0)
  const speechTimer = useRef(null)

  const consigne = CONSIGNE[level]
  const task =
    level === 'fondamental'
      ? "Écoutez la consigne et entourez l'image demandée."
      : "Notez l'énoncé dicté pendant que le cours continue."

  function stopSpeech() {
    if (speechTimer.current) {
      clearInterval(speechTimer.current)
      speechTimer.current = null
    }
    if (SPEECH_OK) {
      try { window.speechSynthesis.cancel() } catch { /* noop */ }
    }
  }

  useEffect(() => {
    if (!started || reduced) return
    t0.current = performance.now()
    const DURATION = 20000

    // Speak the consigne at constant volume, repeated, so the rising noise masks it.
    speakConsigne(consigne)
    speechTimer.current = setInterval(() => speakConsigne(consigne), 6500)

    const tick = (now) => {
      const p = Math.min(1, (now - t0.current) / DURATION)
      setIntensity(p)
      audio.setIntensity(p)
      if (p < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        stopSpeech() // stop repeating once the scene is over
      }
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      stopSpeech()
    }
  }, [started, reduced, audio, consigne])

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
        <p className="read">{task}</p>
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
          Imaginez : une consigne vous est donnée à voix haute — « {consigne} » — mais
          pendant que vous tentez de la suivre, les chaises raclent, des voix chuchotent, un néon
          grésille, le couloir résonne, une sonnerie retentit. Chaque couche s'ajoute, sans filtre,
          et la consigne se noie dans le bruit. La tâche, simple au départ, devient presque impossible.
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
        // No speech synthesis available: fall back to the written consigne.
        <p className="read" style={{ filter: `blur(${blur}px)` }}>{consigne}</p>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-slate-900"
        style={{ opacity: intensity * 0.25 }}
      />
      <p className="text-sm text-slate-500">Intensité : {Math.round(intensity * 100)}%</p>

      {done && (
        <div className="relative space-y-3">
          <p className="read rounded bg-slate-100 p-3">
            La consigne était : <strong>« {consigne} »</strong>. Avez-vous pu la suivre
            entièrement ?
          </p>
          <button onClick={finish} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
            Terminer la scène
          </button>
        </div>
      )}
    </div>
  )
}
