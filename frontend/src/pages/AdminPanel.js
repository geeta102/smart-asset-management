import React, { useState, useEffect } from 'react'
import { getAllBookings, updateBookingStatus } from '../api'

function AdminPanel() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('PENDING')
  const [message, setMessage] = useState('')

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await getAllBookings()
      setBookings(data)
    } catch (err) { console.error(err) }
  }

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      setMessage(`Booking ${status} successfully!`)
      fetchBookings()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating status')
    }
  }

  const getStatusStyle = (status) => {
    const map = {
      PENDING: { backgroundColor: '#fffbeb', color: '#92400e' },
      APPROVED: { backgroundColor: '#ecfdf5', color: '#047857' },
      REJECTED: { backgroundColor: '#fff1f2', color: '#be123c' },
      RETURNED: { backgroundColor: '#eef2ff', color: '#4338ca' },
    }
    return map[status] || {}
  }

  const filtered = bookings.filter(b => filter === 'ALL' ? true : b.status === filter)

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Panel ⚙️</h2>

      {message && (
        <div style={styles.message} onClick={() => setMessage('')}>{message} ✕</div>
      )}

      {/* Summary Cards */}
      <div style={styles.cardGrid}>
        {['PENDING', 'APPROVED', 'REJECTED', 'RETURNED'].map(status => (
          <div key={status} style={styles.card} onClick={() => setFilter(status)}>
            <div style={styles.cardNum}>
              {bookings.filter(b => b.status === status).length}
            </div>
            <div style={styles.cardLabel}>{status}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RETURNED'].map(tab => (
          <button key={tab} style={{ ...styles.tab, ...(filter === tab ? styles.activeTab : {}) }}
            onClick={() => setFilter(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>No bookings in this category</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Start</th>
                <th style={styles.th}>End</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <tr key={booking.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div>{booking.user?.name}</div>
                    <div style={styles.email}>{booking.user?.email}</div>
                  </td>
                  <td style={styles.td}>{booking.asset?.name}</td>
                  <td style={styles.td}>{booking.quantity}</td>
                  <td style={styles.td}>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...getStatusStyle(booking.status) }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {booking.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={styles.btnApprove}
                          onClick={() => handleStatus(booking.id, 'APPROVED')}>
                          ✓ Approve
                        </button>
                        <button style={styles.btnReject}
                          onClick={() => handleStatus(booking.id, 'REJECTED')}>
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '28px 32px', backgroundColor: '#f4f1ea', minHeight: '100vh',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif' },
  heading: { fontSize: '26px', color: '#1f2937', marginBottom: '26px', fontWeight: '700' },
  message: { backgroundColor: '#ecfdf5', color: '#047857', padding: '12px 14px', borderRadius: '7px',
    marginBottom: '18px', cursor: 'pointer', border: '1px solid #a7f3d0', fontWeight: '600' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '18px', marginBottom: '26px' },
  card: { backgroundColor: '#fffdf8', padding: '22px', borderRadius: '8px',
    boxShadow: '0 10px 28px rgba(17,24,39,0.07)', cursor: 'pointer', textAlign: 'center',
    border: '1px solid #e7dfd2' },
  cardNum: { fontSize: '34px', fontWeight: '800', color: '#111827' },
  cardLabel: { fontSize: '12px', color: '#6b7280', marginTop: '6px', fontWeight: '800',
    textTransform: 'uppercase' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' },
  tab: { padding: '9px 16px', border: '1px solid #d8d2c7', borderRadius: '999px', cursor: 'pointer',
    backgroundColor: '#fffdf8', fontSize: '13px', color: '#4b5563', fontWeight: '700' },
  activeTab: { backgroundColor: '#0f766e', color: 'white', border: '1px solid #0b5f59' },
  empty: { backgroundColor: '#fffdf8', padding: '42px', borderRadius: '8px', textAlign: 'center',
    color: '#6b7280', border: '1px solid #e7dfd2', boxShadow: '0 10px 28px rgba(17,24,39,0.07)' },
  tableWrapper: { backgroundColor: '#fffdf8', borderRadius: '8px', boxShadow: '0 10px 28px rgba(17,24,39,0.07)', overflow: 'auto', border: '1px solid #e7dfd2' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#ebe4d8' },
  th: { padding: '13px 16px', textAlign: 'left', fontSize: '12px', color: '#4b5563', fontWeight: '800',
    textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #eee7dc' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#1f2937' },
  email: { fontSize: '12px', color: '#6b7280', marginTop: '3px' },
  badge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '800',
    border: '1px solid rgba(17,24,39,0.06)' },
  btnApprove: { backgroundColor: '#0f766e', color: 'white', border: '1px solid #0b5f59',
    padding: '7px 12px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
  btnReject: { backgroundColor: '#b91c1c', color: 'white', border: '1px solid #991b1b',
    padding: '7px 12px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }
}

export default AdminPanel
