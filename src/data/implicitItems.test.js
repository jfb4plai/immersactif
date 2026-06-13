import { describe, it, expect } from 'vitest'
import { IMPLICIT_ITEMS } from './implicitItems'

describe('implicit items', () => {
  it('has items per level, each with a prompt, a literal choice and the expected one', () => {
    ['fondamental', 'secondaire'].forEach((lvl) => {
      const items = IMPLICIT_ITEMS[lvl]
      expect(items.length).toBeGreaterThanOrEqual(2)
      items.forEach((it) => {
        expect(it.instruction).toBeTruthy()
        expect(it.literal).toBeTruthy()
        expect(it.expected).toBeTruthy()
        expect(it.reframe).toBeTruthy()
      })
    })
  })
})
