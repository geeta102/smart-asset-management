import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      loginUser(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📦 AssetManager</h2>
        <h3 style={styles.subtitle}>Login</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f4f1ea', padding: '32px',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif' },
  card: { backgroundColor: '#fffdf8', padding: '44px', borderRadius: '10px',
    boxShadow: '0 18px 50px rgba(17,24,39,0.10)', width: '100%', maxWidth: '420px',
    border: '1px solid #e7dfd2' },
  title: { textAlign: 'center', color: '#1f2937', marginBottom: '6px', fontSize: '28px',
    fontWeight: '700', letterSpacing: '0.2px' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '28px', fontWeight: '500',
    fontSize: '16px' },
  input: { width: '100%', padding: '13px 14px', marginBottom: '14px', border: '1px solid #d8d2c7',
    borderRadius: '7px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fffaf0',
    color: '#111827', outlineColor: '#0f766e' },
  btn: { width: '100%', padding: '13px', backgroundColor: '#0f766e', color: 'white',
    border: '1px solid #0b5f59', borderRadius: '7px', fontSize: '15px', cursor: 'pointer',
    fontWeight: '700' },
  error: { backgroundColor: '#fff1f2', color: '#be123c', padding: '11px 12px',
    borderRadius: '7px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecdd3' },
  link: { textAlign: 'center', marginTop: '18px', fontSize: '14px', color: '#6b7280' }
}

export default Login
