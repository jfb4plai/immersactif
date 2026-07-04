import { describe, it, expect } from 'vitest'
import { SCENE_ORDER, isHubAvailable, nextNarrativeScene } from './hub'

describe('hub', () => {
  it('defines the narrative order', () => {
    expect(SCENE_ORDER).toEqual(['sensory', 'implicit', 'context', 'unforeseen'])
  })

  it('animateur mode makes the hub available regardless of progress', () => {
    expect(isHubAvailable({ mode: 'animateur', completedScenes: [] })).toBe(true)
  })

  it('decouverte unlocks the hub only after all scenes are done', () => {
    expect(isHubAvailable({ mode: 'decouverte', completedScenes: ['sensory'] })).toBe(false)
    expect(
      isHubAvailable({
        mode: 'decouverte',
        completedScenes: ['sensory', 'implicit', 'context', 'unforeseen'],
      })
    ).toBe(true)
  })

  it('returns the next unfinished narrative scene, or null when done', () => {
    expect(nextNarrativeScene([])).toBe('sensory')
    expect(nextNarrativeScene(['sensory'])).toBe('implicit')
    expect(nextNarrativeScene(['sensory', 'implicit'])).toBe('context')
    expect(nextNarrativeScene(['sensory', 'implicit', 'context'])).toBe('unforeseen')
    expect(nextNarrativeScene(['sensory', 'implicit', 'context', 'unforeseen'])).toBe(null)
  })
})
