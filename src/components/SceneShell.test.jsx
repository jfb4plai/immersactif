import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SceneShell } from './SceneShell'

describe('SceneShell', () => {
  it('renders the gauge and a permanent exit button', () => {
    const onExit = vi.fn()
    render(
      <SceneShell energy={70} onExit={onExit} title="Test">
        <p>contenu</p>
      </SceneShell>
    )
    expect(screen.getByText('contenu')).toBeInTheDocument()
    expect(screen.getByText(/70/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /sortir de la scène/i }))
    expect(onExit).toHaveBeenCalled()
  })
})
