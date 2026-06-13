import { useEffect, useRef, useState } from 'react'
import { AudioEngine } from './AudioEngine'

const LAYERS = ['whispers', 'corridor', 'chairs', 'bell']

export function useAudioLayers() {
  const engineRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    return () => engineRef.current?.stop()
  }, [])

  async function init() {
    if (engineRef.current) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return // no Web Audio: scene falls back to visual-only
    const ctx = new Ctx()
    const engine = new AudioEngine(ctx, LAYERS)
    await Promise.all(
      LAYERS.map((name) =>
        engine.load(name, `${import.meta.env.BASE_URL}audio/${name}.wav`).catch(() => {})
      )
    )
    await engine.start()
    engineRef.current = engine
    setReady(true)
  }

  function setIntensity(v) {
    engineRef.current?.setIntensity(v)
  }

  function stop() {
    engineRef.current?.stop()
  }

  return { init, setIntensity, stop, ready }
}
