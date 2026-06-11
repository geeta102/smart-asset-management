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
    padding: '12px 24px', backgroundColor: '#1e293b', color: 'white' },
  brand: { fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' },
  user: { color: '#94a3b8', fontSize: '14px' },
  btn: { backgroundColor: '#ef4444', color: 'white', border: 'none',
    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }
}

export default Navbar