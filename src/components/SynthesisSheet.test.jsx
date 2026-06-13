import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SynthesisSheet } from './SynthesisSheet'

describe('SynthesisSheet', () => {
  it('disables print until a gesture is personalized, then enables it', () => {
    const onPersonalize = vi.fn()
    const { rerender } = render(
      <SynthesisSheet
        selectedGestures={{ g1: { label: 'Geste', personalization: '' } }}
        onPersonalize={onPersonalize}
      />
    )
    const printBtn = screen.getByRole('button', { name: /imprimer/i })
    expect(printBtn).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/pour ma classe/i), { target: { value: 'Concret' } })
    expect(onPersonalize).toHaveBeenCalledWith('g1', 'Concret')
    rerender(
      <SynthesisSheet
        selectedGestures={{ g1: { label: 'Geste', personalization: 'Concret' } }}
        onPersonalize={onPersonalize}
      />
    )
    expect(screen.getByRole('button', { name: /imprimer/i })).toBeEnabled()
  })

  it('shows an empty-state message when no gestures are selected', () => {
    render(<SynthesisSheet selectedGestures={{}} onPersonalize={() => {}} />)
    expect(screen.getByText(/aucun geste sélectionné/i)).toBeInTheDocument()
  })
})
