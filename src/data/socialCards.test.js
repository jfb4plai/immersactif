import { describe, it, expect } from 'vitest'
import { SOCIAL_CARDS } from './socialCards'
import { REFERENCES } from './references'

describe('social cards', () => {
  it('has reading cards, each with title, body and a valid RISS ref', () => {
    expect(SOCIAL_CARDS.length).toBeGreaterThanOrEqual(2)
    SOCIAL_CARDS.forEach((c) => {
      expect(c.title).toBeTruthy()
      expect(c.body).toBeTruthy()
      expect(REFERENCES[c.ref]).toBeTruthy()
    })
  })
})
