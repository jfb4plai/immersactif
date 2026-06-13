import { describe, it, expect } from 'vitest'
import { appReducer, initialState } from './appReducer'

describe('appReducer', () => {
  it('acknowledges ethics', () => {
    const s = appReducer(initialState, { type: 'ACK_ETHICS' })
    expect(s.consentEthics).toBe(true)
  })

  it('sets level and mode; animateur unlocks the hub immediately', () => {
    let s = appReducer(initialState, { type: 'SET_LEVEL', level: 'secondaire' })
    expect(s.level).toBe('secondaire')
    s = appReducer(s, { type: 'SET_MODE', mode: 'animateur' })
    expect(s.mode).toBe('animateur')
    expect(s.hubUnlocked).toBe(true)
  })

  it('decouverte mode does not unlock the hub up front', () => {
    const s = appReducer(initialState, { type: 'SET_MODE', mode: 'decouverte' })
    expect(s.hubUnlocked).toBe(false)
  })

  it('drains energy and clamps at 0, never increases', () => {
    let s = appReducer(initialState, { type: 'DRAIN_ENERGY', amount: 40 })
    expect(s.energy).toBe(60)
    s = appReducer(s, { type: 'DRAIN_ENERGY', amount: 80 })
    expect(s.energy).toBe(0)
    s = appReducer(s, { type: 'DRAIN_ENERGY', amount: -10 })
    expect(s.energy).toBe(0)
  })

  it('records completed scenes without duplicates', () => {
    let s = appReducer(initialState, { type: 'COMPLETE_SCENE', scene: 'sensory' })
    s = appReducer(s, { type: 'COMPLETE_SCENE', scene: 'sensory' })
    expect(s.completedScenes).toEqual(['sensory'])
  })

  it('toggles a gesture on and off', () => {
    let s = appReducer(initialState, {
      type: 'TOGGLE_GESTURE',
      id: 'g1',
      label: "J'annonce le changement de local dès l'accueil",
    })
    expect(s.selectedGestures.g1.label).toMatch(/changement de local/)
    expect(s.selectedGestures.g1.personalization).toBe('')
    s = appReducer(s, { type: 'TOGGLE_GESTURE', id: 'g1' })
    expect(s.selectedGestures.g1).toBeUndefined()
  })

  it('stores a personalization for a selected gesture', () => {
    let s = appReducer(initialState, { type: 'TOGGLE_GESTURE', id: 'g1', label: 'X' })
    s = appReducer(s, { type: 'SET_PERSONALIZATION', id: 'g1', text: 'Pour ma 3e année…' })
    expect(s.selectedGestures.g1.personalization).toBe('Pour ma 3e année…')
  })

  it('RESET returns a fresh initial state', () => {
    let s = appReducer(initialState, { type: 'ACK_ETHICS' })
    s = appReducer(s, { type: 'RESET' })
    expect(s).toEqual(initialState)
  })
})
