import { describe, it, expect } from 'vitest'
import { CONTEXT_ITEMS } from './contextItems'

describe('context items', () => {
  it('has at least 2 excerpts per level, each with lines, 3 questions and a context reveal', () => {
    ['fondamental', 'secondaire'].forEach((lvl) => {
      const items = CONTEXT_ITEMS[lvl]
      expect(items.length).toBeGreaterThanOrEqual(2)
      items.forEach((item) => {
        expect(item.lines.length).toBeGreaterThanOrEqual(3)
        expect(item.context).toBeTruthy()
        expect(item.questions.length).toBe(3)
        item.questions.forEach((q) => {
          expect(q.q).toBeTruthy()
          expect(q.spontaneous).toBeTruthy()
          expect(q.real).toBeTruthy()
        })
      })
    })
  })
})
