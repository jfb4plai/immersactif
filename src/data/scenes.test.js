import { describe, it, expect } from 'vitest'
import { GESTURES } from './gestures'
import { SCENES } from './scenes'
import { REFERENCES } from './references'

const SCENE_IDS = ['sensory', 'implicit', 'unforeseen']

describe('scene content', () => {
  it('each scene has 3-5 gestures per level', () => {
    SCENE_IDS.forEach((id) => {
      ['fondamental', 'secondaire'].forEach((lvl) => {
        const list = GESTURES[id][lvl]
        expect(list.length).toBeGreaterThanOrEqual(3)
        expect(list.length).toBeLessThanOrEqual(5)
        list.forEach((g) => {
          expect(g.id).toBeTruthy()
          expect(g.label).toBeTruthy()
        })
      })
    })
  })

  it('gesture ids are globally unique', () => {
    const ids = []
    SCENE_IDS.forEach((id) =>
      ['fondamental', 'secondaire'].forEach((lvl) =>
        GESTURES[id][lvl].forEach((g) => ids.push(g.id))
      )
    )
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each scene has a title and a 3-step debrief referencing valid RISS ids', () => {
    SCENE_IDS.forEach((id) => {
      const s = SCENES[id]
      expect(s.title).toBeTruthy()
      expect(s.debrief.lived).toBeTruthy()
      expect(s.debrief.student).toBeTruthy()
      expect(s.debrief.adjust).toBeTruthy()
      s.refs.forEach((rid) => expect(REFERENCES[rid]).toBeTruthy())
    })
  })
})
