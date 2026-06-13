import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { AppStateProvider } from './state/AppStateContext'

vi.mock('./audio/useAudioLayers', () => ({
  useAudioLayers: () => ({ init: vi.fn(), setIntensity: vi.fn(), stop: vi.fn(), ready: true }),
}))

function renderApp() {
  return render(
    <AppStateProvider>
      <App />
    </AppStateProvider>
  )
}

describe('App flow', () => {
  beforeEach(() => localStorage.clear())

  it('entry → start (découverte/fondamental) lands in the first scene', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /fondamental/i }))
    fireEvent.click(screen.getByRole('button', { name: /découverte/i }))
    fireEvent.click(screen.getByRole('button', { name: /commencer/i }))
    expect(screen.getByText(/la consigne dans le bruit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sortir de la scène/i })).toBeInTheDocument()
  })

  it('animateur mode lands directly on the hub', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /secondaire/i }))
    fireEvent.click(screen.getByRole('button', { name: /animateur/i }))
    fireEvent.click(screen.getByRole('button', { name: /commencer/i }))
    expect(screen.getByRole('heading', { name: /parcours/i })).toBeInTheDocument()
  })
})
