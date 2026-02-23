import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorAlert } from '../components/ErrorAlert'

describe('ErrorAlert', () => {
  it('renders nothing when error is null', () => {
    const { container } = render(<ErrorAlert error={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the error message from an Error object', () => {
    render(<ErrorAlert error={new Error('Something went wrong')} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders a fallback message for unknown error types', () => {
    render(<ErrorAlert error={{ unexpected: true }} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('dismisses the alert when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorAlert error={new Error('Dismiss me')} />)

    expect(screen.getByText('Dismiss me')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument()
  })
})
