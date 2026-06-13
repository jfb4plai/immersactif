import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AppStateProvider, useAppState } from './AppStateContext'

function Probe() {
  const { state, dispatch } = useAppState()
  return (
    <div>
      <span data-testid="energy">{state.energy}</span>
      <button onClick={() => dispatch({ type: 'DRAIN_ENERGY', amount: 10 })}>drain</button>
    </div>
  )
}

describe('AppStateContext', () => {
  beforeEach(() => localStorage.clear())

  it('provides state and dispatch, and persists across remounts', () => {
    const { unmount } = render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>
    )
    act(() => screen.getByText('drain').click())
    expect(screen.getByTestId('energy').textContent).toBe('90')
    unmount()
    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>
    )
    expect(screen.getByTestId('energy').textContent).toBe('90')
  })
})
