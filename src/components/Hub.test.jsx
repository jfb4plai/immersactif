import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Hub } from './Hub'

describe('Hub', () => {
  it('renders scene cards, the social card and the sheet entry, and navigates', () => {
    const onOpen = vi.fn()
    render(<Hub completedScenes={['sensory', 'implicit', 'unforeseen']} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole('button', { name: /la consigne dans le bruit/i }))
    expect(onOpen).toHaveBeenCalledWith('sensory')
    fireEvent.click(screen.getByRole('button', { name: /interactions sociales/i }))
    expect(onOpen).toHaveBeenCalledWith('social')
    fireEvent.click(screen.getByRole('button', { name: /ma fiche/i }))
    expect(onOpen).toHaveBeenCalledWith('synthesis')
  })
})
