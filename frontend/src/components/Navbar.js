import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>📦 AssetManager</div>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/assets" style={styles.link}>Assets</Link>
        <Link to="/bookings" style={styles.link}>My Bookings</Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin" style={styles.link}>Admin Panel</Link>
        )}
        <span style={styles.user}>👤 {user?.name}</span>
        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 32px', backgroundColor: '#111827', color: '#f9fafb',
    borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    flexWrap: 'wrap', gap: '14px' },
  brand: { fontSize: '19px', fontWeight: '700', color: '#f9fafb', letterSpacing: '0.2px' },
  links: { display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' },
  link: { color: '#d1d5db', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  user: { color: '#a7f3d0', fontSize: '14px', fontWeight: '500' },
  btn: { backgroundColor: '#b91c1c', color: 'white', border: '1px solid rgba(255,255,255,0.12)',
    padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }
}

export default Navbar
