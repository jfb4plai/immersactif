// Procedurally generates four looping mono WAV ambience layers for the sensory scene.
// No external deps. Output: public/audio/{whispers,corridor,chairs,bell}.wav
// These are synthesized (public domain by construction); replace with CC0 field
// recordings later if desired — the app loads public/audio/*.wav unchanged.
import { writeFileSync, mkdirSync } from 'node:fs'

const SR = 22050
const DUR = 5
const N = SR * DUR
const OUT = 'public/audio'

let seed = 12345
function rng() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x7fffffff
}

function toWav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + samples.length * 2, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(1, 22)
  buf.writeUInt32LE(SR, 24)
  buf.writeUInt32LE(SR * 2, 28)
  buf.writeUInt16LE(2, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(samples.length * 2, 40)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2)
  }
  return buf
}

// short edge fade to avoid loop clicks
function fadeEdges(s, ms = 40) {
  const f = Math.floor((ms / 1000) * SR)
  for (let i = 0; i < f; i++) {
    const g = i / f
    s[i] *= g
    s[s.length - 1 - i] *= g
  }
  return s
}

function whispers() {
  const s = new Float32Array(N)
  let prev = 0
  for (let i = 0; i < N; i++) {
    const noise = rng() * 2 - 1
    prev = prev * 0.92 + noise * 0.08
    s[i] = prev * 0.9
  }
  return fadeEdges(s)
}

function corridor() {
  const s = new Float32Array(N)
  let prev = 0
  for (let i = 0; i < N; i++) {
    const noise = rng() * 2 - 1
    prev = prev * 0.985 + noise * 0.015
    s[i] = prev * 2.2
  }
  return fadeEdges(s)
}

function chairs() {
  const s = new Float32Array(N)
  let t = Math.floor(SR * 0.4)
  while (t < N) {
    const len = Math.floor(SR * (0.03 + rng() * 0.05))
    for (let i = 0; i < len && t + i < N; i++) {
      const env = 1 - i / len
      s[t + i] = (rng() * 2 - 1) * env * 0.6
    }
    t += Math.floor(SR * (0.5 + rng() * 0.9))
  }
  return fadeEdges(s)
}

function bell() {
  const s = new Float32Array(N)
  const period = Math.floor(SR * 2.5)
  for (let start = 0; start < N; start += period) {
    const len = Math.floor(SR * 1.2)
    for (let i = 0; i < len && start + i < N; i++) {
      const env = Math.exp(-i / (SR * 0.25))
      s[start + i] += Math.sin((2 * Math.PI * 1760 * i) / SR) * env * 0.35
    }
  }
  return fadeEdges(s)
}

mkdirSync(OUT, { recursive: true })
const layers = { whispers, corridor, chairs, bell }
for (const [name, fn] of Object.entries(layers)) {
  seed = 12345 // reset for reproducibility per layer
  writeFileSync(`${OUT}/${name}.wav`, toWav(fn()))
  console.log(`wrote ${OUT}/${name}.wav`)
}
