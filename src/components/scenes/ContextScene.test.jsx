import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContextScene } from './ContextScene'

describe('ContextScene', () => {
  it('reveals the context per excerpt and calls onDone after the last one', () => {
    const onDone = vi.fn()
    render(<ContextScene level="fondamental" onDone={onDone} />)

    // Excerpt 1: answer then reveal the context.
    fireEvent.click(screen.getByRole('button', { name: /découvrir le contexte/i }))
    expect(screen.getByText('Le contexte')).toBeInTheDocument()
    expect(onDone).not.toHaveBeenCalled()

    // Move to excerpt 2.
    fireEvent.click(screen.getByRole('button', { name: /extrait suivant/i }))
    // Reveal is reset for the new excerpt.
    fireEvent.click(screen.getByRole('button', { name: /découvrir le contexte/i }))
    fireEvent.click(screen.getByRole('button', { name: /terminer la scène/i }))
    expect(onDone).toHaveBeenCalled()
  })
})
