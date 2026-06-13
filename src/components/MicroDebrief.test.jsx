import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MicroDebrief } from './MicroDebrief'

const scene = {
  title: 'T',
  refs: ['fino2017'],
  debrief: { lived: 'LIVED', student: 'STUDENT', adjust: 'ADJUST' },
}
const gestures = [{ id: 'g1', label: 'Geste un' }]

describe('MicroDebrief', () => {
  it('renders the three debrief steps and toggles a gesture', () => {
    const onToggle = vi.fn()
    render(
      <MicroDebrief scene={scene} gestures={gestures} selected={{}} onToggle={onToggle} onContinue={() => {}} />
    )
    expect(screen.getByText('LIVED')).toBeInTheDocument()
    expect(screen.getByText('STUDENT')).toBeInTheDocument()
    expect(screen.getByText('ADJUST')).toBeInTheDocument()
    expect(screen.getByText(/Fino/)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Geste un'))
    expect(onToggle).toHaveBeenCalledWith({ id: 'g1', label: 'Geste un' })
  })
})
