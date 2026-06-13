// Layer ordering = order of escalation. Intensity 0..1 fades layers in,
// each layer crossing its threshold proportionally to its index.
export class AudioEngine {
  constructor(ctx, layerNames) {
    this.ctx = ctx
    this.buffers = {} // name -> AudioBuffer, filled by load()
    this.layers = layerNames.map((name, i) => {
      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.connect(ctx.destination)
      return { name, gain, source: null, threshold: i / layerNames.length }
    })
    this.intensity = 0
  }

  setIntensity(value) {
    this.intensity = Math.max(0, Math.min(1, value))
    this.layers.forEach((l) => {
      // gain ramps from 0 at its threshold up to a ceiling as intensity grows
      const over = this.intensity - l.threshold
      l.gain.gain.value = over <= 0 ? 0 : Math.min(0.8, over * 1.6)
    })
  }

  async load(name, url) {
    const res = await fetch(url)
    const arr = await res.arrayBuffer()
    this.buffers[name] = await this.ctx.decodeAudioData(arr)
  }

  async start() {
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    this.layers.forEach((l) => {
      if (l.source || !this.buffers[l.name]) return
      const src = this.ctx.createBufferSource()
      src.buffer = this.buffers[l.name]
      src.loop = true
      src.connect(l.gain)
      src.start(0)
      l.source = src
    })
  }

  stop() {
    this.layers.forEach((l) => {
      if (l.source) {
        try { l.source.stop() } catch { /* already stopped */ }
        l.source = null
      }
      l.gain.gain.value = 0
    })
  }
}
