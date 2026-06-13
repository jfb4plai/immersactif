import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntryScreen } from './EntryScreen'

describe('EntryScreen', () => {
  it('shows the ethical warning and blocks start until level+mode chosen', () => {
    const onStart = vi.fn()
    render(<EntryScreen onStart={onStart} />)
    expect(screen.getByText(/aucune simulation ne fait vivre/i)).toBeInTheDocument()
    const startBtn = screen.getByRole('button', { name: /commencer/i })
    expect(startBtn).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /fondamental/i }))
    fireEvent.click(screen.getByRole('button', { name: /découverte/i }))
    expect(startBtn).toBeEnabled()
    fireEvent.click(startBtn)
    expect(onStart).toHaveBeenCalledWith({ level: 'fondamental', mode: 'decouverte' })
  })
})
