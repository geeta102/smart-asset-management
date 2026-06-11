import React, { useState, useEffect } from 'react'
import { getAssets, getAllBookings, getMyBookings } from '../api'
import { useAuth } from '../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

function Dashboard() {
  const { user } = useAuth()
  const [assets, setAssets] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: assetData } = await getAssets()
      setAssets(assetData)
      if (user?.role === 'ADMIN') {
        const { data: bookingData } = await getAllBookings()
        setBookings(bookingData)
      } else {
        const { data: bookingData } = await getMyBookings()
        setBookings(bookingData)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const totalAssets = assets.length
  const availableAssets = assets.filter(a => a.available > 0).length
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
  const approvedBookings = bookings.filter(b => b.status === 'APPROVED').length

  const categoryData = assets.reduce((acc, asset) => {
    const existing = acc.find(a => a.name === asset.category)
    if (existing) existing.count++
    else acc.push({ name: asset.category, count: 1 })
    return acc
  }, [])

  const bookingStatusData = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'PENDING').length },
    { name: 'Approved', value: bookings.filter(b => b.status === 'APPROVED').length },
    { name: 'Rejected', value: bookings.filter(b => b.status === 'REJECTED').length },
    { name: 'Returned', value: bookings.filter(b => b.status === 'RETURNED').length },
  ].filter(d => d.value > 0)

  const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#6366f1']

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome, {user?.name}! 👋</h2>

      {/* Summary Cards */}
      <div style={styles.cardGrid}>
        <div style={{ ...styles.card, borderLeft: '4px solid #3b82f6' }}>
          <div style={styles.cardNum}>{totalAssets}</div>
          <div style={styles.cardLabel}>Total Assets</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '4px solid #10b981' }}>
          <div style={styles.cardNum}>{availableAssets}</div>
          <div style={styles.cardLabel}>Available Assets</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '4px solid #f59e0b' }}>
          <div style={styles.cardNum}>{pendingBookings}</div>
          <div style={styles.cardLabel}>Pending Bookings</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '4px solid #6366f1' }}>
          <div style={styles.cardNum}>{approvedBookings}</div>
          <div style={styles.cardLabel}>Approved Bookings</div>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Assets by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Booking Status</h3>
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={bookingStatusData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={80} label>
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '80px' }}>No bookings yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  heading: { fontSize: '24px', color: '#1e293b', marginBottom: '24px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', marginBottom: '24px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardNum: { fontSize: '32px', fontWeight: 'bold', color: '#1e293b' },
  cardLabel: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px' },
  chartCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  chartTitle: { fontSize: '16px', color: '#1e293b', marginBottom: '12px' }
}

export default Dashboard