import { describe, it, expect } from 'vitest'
import { IMPLICIT_ITEMS } from './implicitItems'

describe('implicit items', () => {
  it('has 5 double-meaning items per level, each with instruction, reaction and why', () => {
    ['fondamental', 'secondaire'].forEach((lvl) => {
      const items = IMPLICIT_ITEMS[lvl]
      expect(items.length).toBeGreaterThanOrEqual(5)
      items.forEach((it) => {
        expect(it.instruction).toBeTruthy()
        expect(it.reaction).toBeTruthy()
        expect(it.why).toBeTruthy()
      })
    })
  })
})
