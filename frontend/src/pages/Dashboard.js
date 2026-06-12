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

  const COLORS = ['#d97706', '#0f766e', '#b91c1c', '#4f46e5']

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome, {user?.name}! 👋</h2>

      {/* Summary Cards */}
      <div style={styles.cardGrid}>
        <div style={{ ...styles.card, borderLeft: '4px solid #0f766e' }}>
          <div style={styles.cardNum}>{totalAssets}</div>
          <div style={styles.cardLabel}>Total Assets</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '4px solid #15803d' }}>
          <div style={styles.cardNum}>{availableAssets}</div>
          <div style={styles.cardLabel}>Available Assets</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '4px solid #d97706' }}>
          <div style={styles.cardNum}>{pendingBookings}</div>
          <div style={styles.cardLabel}>Pending Bookings</div>
        </div>
        <div style={{ ...styles.card, borderLeft: '4px solid #4f46e5' }}>
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
              <Bar dataKey="count" fill="#0f766e" />
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
  container: { padding: '28px 32px', backgroundColor: '#f4f1ea', minHeight: '100vh',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif' },
  heading: { fontSize: '26px', color: '#1f2937', marginBottom: '26px', fontWeight: '700' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '18px', marginBottom: '26px' },
  card: { backgroundColor: '#fffdf8', padding: '22px', borderRadius: '8px',
    boxShadow: '0 10px 28px rgba(17,24,39,0.07)', border: '1px solid #e7dfd2' },
  cardNum: { fontSize: '34px', fontWeight: '800', color: '#111827' },
  cardLabel: { fontSize: '13px', color: '#6b7280', marginTop: '6px', fontWeight: '600',
    textTransform: 'uppercase' },
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px' },
  chartCard: { backgroundColor: '#fffdf8', padding: '22px', borderRadius: '8px',
    boxShadow: '0 10px 28px rgba(17,24,39,0.07)', border: '1px solid #e7dfd2' },
  chartTitle: { fontSize: '16px', color: '#1f2937', marginBottom: '14px', fontWeight: '700' }
}

export default Dashboard
