import React, { useState, useEffect } from 'react'
import { getMyBookings, returnAsset } from '../api'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await getMyBookings()
      setBookings(data)
    } catch (err) { console.error(err) }
  }

  const handleReturn = async (id) => {
    if (window.confirm('Return this asset?')) {
      try {
        await returnAsset(id)
        setMessage('Asset returned successfully!')
        fetchBookings()
      } catch (err) {
        setMessage(err.response?.data?.message || 'Return failed')
      }
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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Bookings 📋</h2>

      {message && (
        <div style={styles.message} onClick={() => setMessage('')}>{message} ✕</div>
      )}

      {bookings.length === 0 ? (
        <div style={styles.empty}>
          No bookings yet. Go to Assets page and book something! 📦
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Start Date</th>
                <th style={styles.th}>End Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} style={styles.tr}>
                  <td style={styles.td}>{booking.asset?.name}</td>
                  <td style={styles.td}>{booking.asset?.category}</td>
                  <td style={styles.td}>{booking.quantity}</td>
                  <td style={styles.td}>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...getStatusStyle(booking.status) }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {booking.status === 'APPROVED' && (
                      <button style={styles.btnReturn} onClick={() => handleReturn(booking.id)}>
                        Return
                      </button>
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
  empty: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b' },
  tableWrapper: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f1f5f9' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#1e293b' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  btnReturn: { backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
}

export default Bookings