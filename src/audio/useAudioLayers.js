import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AudioEngine } from './AudioEngine'

const LAYERS = ['whispers', 'corridor', 'chairs', 'bell']

export function useAudioLayers() {
  const engineRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    return () => engineRef.current?.stop()
  }, [])

  const init = useCallback(async () => {
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
  }, [])

  const setIntensity = useCallback((v) => {
    engineRef.current?.setIntensity(v)
  }, [])

  const stop = useCallback(() => {
    engineRef.current?.stop()
  }, [])

  const api = useMemo(() => ({ init, setIntensity, stop, ready }), [init, setIntensity, stop, ready])
  return api
}
