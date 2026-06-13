import { describe, it, expect } from 'vitest'
import { SCENE_DRAIN, energyBand } from './energy'

describe('energy', () => {
  it('defines a drain amount for each scene', () => {
    expect(SCENE_DRAIN.sensory).toBeGreaterThan(0)
    expect(SCENE_DRAIN.implicit).toBeGreaterThan(0)
    expect(SCENE_DRAIN.unforeseen).toBeGreaterThan(0)
  })

  it('maps energy to a band', () => {
    expect(energyBand(90).key).toBe('ok')
    expect(energyBand(50).key).toBe('low')
    expect(energyBand(15).key).toBe('critical')
    expect(energyBand(0).key).toBe('critical')
  })

  it('each band has a label and a tailwind color class', () => {
    const b = energyBand(50)
    expect(typeof b.label).toBe('string')
    expect(b.color).toMatch(/^(bg|text)-/)
  })
})
