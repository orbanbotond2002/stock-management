import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function getRedirectTo(locationState: unknown): string {
  const s = locationState as { from?: { pathname?: string } } | null
  return s?.from?.pathname ?? '/'
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values.email.trim(), values.password)
      navigate(getRedirectTo(location.state), { replace: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setFormError(message)
    }
  })

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Login</h1>
        <div className="muted" style={{ marginBottom: 14 }}>
          Stock management platform
        </div>

        <form onSubmit={onSubmit} className="form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email format',
                },
              })}
            />
            {errors.email && (
              <div className="errorText">{errors.email.message}</div>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 4, message: 'Password is too short' },
              })}
            />
            {errors.password && (
              <div className="errorText">{errors.password.message}</div>
            )}
          </div>

          {formError && <div className="errorBox">{formError}</div>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
