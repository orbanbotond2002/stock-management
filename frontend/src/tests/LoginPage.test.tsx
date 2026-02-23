import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'

const mockLogin = vi.fn()

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('disables the button and shows "Signing in…" while request is pending', async () => {
    let resolveLogin!: () => void
    mockLogin.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve
        })
    )
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'mypassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    const button = await screen.findByRole('button', { name: /signing in/i })
    expect(button).toBeDisabled()

    resolveLogin()
  })

  it('shows password too short error', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'abc')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Password is too short')).toBeInTheDocument()
  })

  it('shows error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  it('calls login with trimmed email and password on valid submit', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/email/i), '  test@example.com  ')
    await user.type(screen.getByLabelText(/password/i), 'mypassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await vi.waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'mypassword')
    })
  })
})
