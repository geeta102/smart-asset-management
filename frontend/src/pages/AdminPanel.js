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
      PENDING: { backgroundColor: '#fef9c3', color: '#854d0e' },
      APPROVED: { backgroundColor: '#dcfce7', color: '#166534' },
      REJECTED: { backgroundColor: '#fee2e2', color: '#991b1b' },
      RETURNED: { backgroundColor: '#e0f2fe', color: '#075985' },
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
  container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  heading: { fontSize: '24px', color: '#1e293b', marginBottom: '24px' },
  message: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '8px', marginBottom: '16px', cursor: 'pointer' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'center' },
  cardNum: { fontSize: '32px', fontWeight: 'bold', color: '#1e293b' },
  cardLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  tab: { padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white', fontSize: '13px', color: '#64748b' },
  activeTab: { backgroundColor: '#3b82f6', color: 'white', border: '1px solid #3b82f6' },
  empty: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b' },
  tableWrapper: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f1f5f9' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#1e293b' },
  email: { fontSize: '12px', color: '#94a3b8' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  btnApprove: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnReject: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
}

export default AdminPanel