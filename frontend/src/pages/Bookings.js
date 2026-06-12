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
      PENDING: { backgroundColor: '#fffbeb', color: '#92400e' },
      APPROVED: { backgroundColor: '#ecfdf5', color: '#047857' },
      REJECTED: { backgroundColor: '#fff1f2', color: '#be123c' },
      RETURNED: { backgroundColor: '#eef2ff', color: '#4338ca' },
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
  container: { padding: '28px 32px', backgroundColor: '#f4f1ea', minHeight: '100vh',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif' },
  heading: { fontSize: '26px', color: '#1f2937', marginBottom: '26px', fontWeight: '700' },
  message: { backgroundColor: '#ecfdf5', color: '#047857', padding: '12px 14px', borderRadius: '7px',
    marginBottom: '18px', cursor: 'pointer', border: '1px solid #a7f3d0', fontWeight: '600' },
  empty: { backgroundColor: '#fffdf8', padding: '42px', borderRadius: '8px', textAlign: 'center',
    color: '#6b7280', border: '1px solid #e7dfd2', boxShadow: '0 10px 28px rgba(17,24,39,0.07)' },
  tableWrapper: { backgroundColor: '#fffdf8', borderRadius: '8px', boxShadow: '0 10px 28px rgba(17,24,39,0.07)', overflow: 'auto', border: '1px solid #e7dfd2' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#ebe4d8' },
  th: { padding: '13px 16px', textAlign: 'left', fontSize: '12px', color: '#4b5563', fontWeight: '800',
    textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #eee7dc' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#1f2937' },
  badge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '800',
    border: '1px solid rgba(17,24,39,0.06)' },
  btnReturn: { backgroundColor: '#0f766e', color: 'white', border: '1px solid #0b5f59',
    padding: '7px 12px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }
}

export default Bookings
