import { describe, it, expect } from 'vitest'
import { REFERENCES, formatRef } from './references'

describe('references', () => {
  it('every reference has id, authors, year and a RISS id', () => {
    Object.values(REFERENCES).forEach((r) => {
      expect(r.authors).toBeTruthy()
      expect(r.year).toBeTruthy()
      expect(r.rissId).toBeTruthy()
    })
  })

  it('formats a reference as a short citation string', () => {
    const s = formatRef('schuhl2020')
    expect(s).toMatch(/Schuhl/)
    expect(s).toMatch(/2020/)
  })
})
