import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns the default when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('k', { a: 1 }))
    expect(result.current[0]).toEqual({ a: 1 })
  })

  it('persists and reads back a value', () => {
    const { result } = renderHook(() => useLocalStorage('k', 0))
    act(() => result.current[1](42))
    expect(result.current[0]).toBe(42)
    expect(JSON.parse(localStorage.getItem('k'))).toBe(42)
  })

  it('falls back silently to in-memory state when storage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const { result } = renderHook(() => useLocalStorage('k', 'x'))
    act(() => result.current[1]('y'))
    expect(result.current[0]).toBe('y') // state still updates
    spy.mockRestore()
  })
})
