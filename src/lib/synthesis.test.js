import { describe, it, expect } from 'vitest'
import { buildSheet, canPrint } from './synthesis'

const gestures = {
  g1: { label: 'Annoncer les changements', personalization: '' },
  g2: { label: 'Afficher la consigne écrite', personalization: 'Au tableau, à gauche.' },
}

describe('synthesis', () => {
  it('builds a sheet listing selected gestures with their personalizations', () => {
    const sheet = buildSheet(gestures)
    expect(sheet.items).toHaveLength(2)
    expect(sheet.items[0]).toMatchObject({ id: 'g1', label: 'Annoncer les changements' })
  })

  it('counts how many gestures are personalized', () => {
    expect(buildSheet(gestures).personalizedCount).toBe(1)
  })

  it('cannot print without at least one personalization', () => {
    expect(canPrint({ g1: { label: 'A', personalization: '' } })).toBe(false)
    expect(canPrint({})).toBe(false)
  })

  it('can print once one gesture is personalized (whitespace does not count)', () => {
    expect(canPrint({ g1: { label: 'A', personalization: '   ' } })).toBe(false)
    expect(canPrint({ g1: { label: 'A', personalization: 'Pour ma classe…' } })).toBe(true)
  })
})
