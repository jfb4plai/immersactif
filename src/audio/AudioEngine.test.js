import { describe, it, expect, vi } from 'vitest'
import { AudioEngine } from './AudioEngine'

function mockContext() {
  const gains = []
  return {
    createGain: () => {
      const g = { gain: { value: 0 }, connect: vi.fn() }
      gains.push(g)
      return g
    },
    createBufferSource: () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), loop: false }),
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    state: 'suspended',
    _gains: gains,
  }
}

describe('AudioEngine', () => {
  it('setIntensity(0) keeps all layer gains at 0', () => {
    const ctx = mockContext()
    const e = new AudioEngine(ctx, ['a', 'b', 'c'])
    e.setIntensity(0)
    e.layers.forEach((l) => expect(l.gain.gain.value).toBe(0))
  })

  it('raising intensity progressively brings in more layers', () => {
    const ctx = mockContext()
    const e = new AudioEngine(ctx, ['a', 'b', 'c', 'd'])
    e.setIntensity(0.25)
    const audibleLow = e.layers.filter((l) => l.gain.gain.value > 0).length
    e.setIntensity(1)
    const audibleHigh = e.layers.filter((l) => l.gain.gain.value > 0).length
    expect(audibleHigh).toBeGreaterThan(audibleLow)
  })

  it('start() resumes a suspended context', async () => {
    const ctx = mockContext()
    const e = new AudioEngine(ctx, ['a'])
    await e.start()
    expect(ctx.resume).toHaveBeenCalled()
  })
})
