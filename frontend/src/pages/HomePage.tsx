import { useAuth } from '../auth/useAuth'

export function HomePage() {
  const { token, logout } = useAuth()

  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>This is a placeholder protected area.</p>
      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        token: {token}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
