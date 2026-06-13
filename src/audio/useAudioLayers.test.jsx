import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAudioLayers } from './useAudioLayers'

describe('useAudioLayers stability', () => {
  it('returns a referentially stable object across rerenders', () => {
    const { result, rerender } = renderHook(() => useAudioLayers())
    const first = result.current
    rerender()
    const second = result.current
    expect(second).toBe(first)
    expect(second.setIntensity).toBe(first.setIntensity)
    expect(second.init).toBe(first.init)
    expect(second.stop).toBe(first.stop)
  })
})
