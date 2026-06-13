import { useEffect, useRef, useState } from 'react'
import { useAudioLayers } from '../../audio/useAudioLayers'

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SensoryScene({ level, onDone }) {
  const audio = useAudioLayers()
  const [started, setStarted] = useState(false)
  const [intensity, setIntensity] = useState(0)
  const reduced = REDUCED()
  const raf = useRef(null)
  const t0 = useRef(0)

  const task =
    level === 'fondamental'
      ? "Écoutez la consigne et entourez l'image demandée."
      : "Notez l'énoncé dicté pendant que le cours continue."

  useEffect(() => {
    if (!started || reduced) return
    t0.current = performance.now()
    const DURATION = 20000
    const tick = (now) => {
      const p = Math.min(1, (now - t0.current) / DURATION)
      setIntensity(p)
      audio.setIntensity(p)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [started, reduced, audio])

  async function begin() {
    if (!reduced) await audio.init()
    setStarted(true)
  }

  if (!started) {
    return (
      <div className="space-y-4">
        <p className="read">{task}</p>
        <p className="text-sm text-amber-700">⚠ Cette scène comporte du son. Réglez votre volume.</p>
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
          Imaginez : vous tentez de {task.toLowerCase()} Pendant ce temps, les chaises raclent, des
          voix chuchotent, un néon grésille, le couloir résonne, une sonnerie retentit. Chaque
          couche s'ajoute, sans filtre. La tâche, simple au départ, devient presque impossible.
        </p>
        <button onClick={() => { audio.stop(); onDone() }} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Terminer la scène
        </button>
      </div>
    )
  }

  const blur = (intensity * 3).toFixed(1)
  return (
    <div className="relative space-y-4">
      <p className="read" style={{ filter: `blur(${blur}px)` }}>{task}</p>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-slate-900"
        style={{ opacity: intensity * 0.25 }}
      />
      <p className="text-sm text-slate-500">Intensité : {Math.round(intensity * 100)}%</p>
      {intensity >= 1 && (
        <button onClick={() => { audio.stop(); onDone() }} className="relative rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Terminer la scène
        </button>
      )}
    </div>
  )
}
