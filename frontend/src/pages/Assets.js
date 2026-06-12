import React, { useState, useEffect } from 'react'
import { getAssets, createAsset, deleteAsset, createBooking } from '../api'
import { useAuth } from '../context/AuthContext'

function Assets() {
  const { user } = useAuth()
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [bookingAsset, setBookingAsset] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', description: '', quantity: '' })
  const [bookingForm, setBookingForm] = useState({ quantity: 1, startDate: '', endDate: '' })
  const [message, setMessage] = useState('')

  useEffect(() => { fetchAssets() }, [])

  const fetchAssets = async () => {
    try {
      const { data } = await getAssets()
      setAssets(data)
    } catch (err) { console.error(err) }
  }

  const handleAddAsset = async (e) => {
    e.preventDefault()
    try {
      await createAsset({ ...form, quantity: parseInt(form.quantity) })
      setMessage('Asset added successfully!')
      setForm({ name: '', category: '', description: '', quantity: '' })
      setShowAddForm(false)
      fetchAssets()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding asset')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this asset?')) {
      try {
        await deleteAsset(id)
        fetchAssets()
      } catch (err) { console.error(err) }
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      await createBooking({ ...bookingForm, assetId: bookingAsset.id })
      setMessage('Booking request submitted!')
      setBookingAsset(null)
      setBookingForm({ quantity: 1, startDate: '', endDate: '' })
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed')
    }
  }

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Assets 📦</h2>
        {user?.role === 'ADMIN' && (
          <button style={styles.btnPrimary} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Asset'}
          </button>
        )}
      </div>

      {message && (
        <div style={styles.message} onClick={() => setMessage('')}>{message} ✕</div>
      )}

      {/* Add Asset Form */}
      {showAddForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: '16px' }}>Add New Asset</h3>
          <form onSubmit={handleAddAsset}>
            <div style={styles.formGrid}>
              <input style={styles.input} placeholder="Asset Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input style={styles.input} placeholder="Category (e.g. Camera)" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <input style={styles.input} placeholder="Quantity" type="number" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <input style={styles.input} placeholder="Description (optional)" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button style={styles.btnPrimary} type="submit">Add Asset</button>
          </form>
        </div>
      )}

      {/* Search */}
      <input style={{ ...styles.input, marginBottom: '16px', maxWidth: '400px' }}
        placeholder="🔍 Search assets..." value={search}
        onChange={(e) => setSearch(e.target.value)} />

      {/* Assets Grid */}
      <div style={styles.grid}>
        {filtered.map(asset => (
          <div key={asset.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.category}>{asset.category}</span>
              <span style={{ ...styles.badge, backgroundColor: asset.available > 0 ? '#ecfdf5' : '#fff1f2',
                color: asset.available > 0 ? '#047857' : '#be123c' }}>
                {asset.available > 0 ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <h3 style={styles.assetName}>{asset.name}</h3>
            {asset.description && <p style={styles.desc}>{asset.description}</p>}
            <div style={styles.quantity}>
              Available: <strong>{asset.available}</strong> / {asset.quantity}
            </div>
            <div style={styles.cardActions}>
              {user?.role !== 'ADMIN' && asset.available > 0 && (
                <button style={styles.btnPrimary} onClick={() => setBookingAsset(asset)}>
                  Book Now
                </button>
              )}
              {user?.role === 'ADMIN' && (
                <button style={styles.btnDanger} onClick={() => handleDelete(asset.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingAsset && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Book: {bookingAsset.name}</h3>
            <form onSubmit={handleBooking}>
              <input style={styles.input} type="number" placeholder="Quantity"
                min="1" max={bookingAsset.available} value={bookingForm.quantity}
                onChange={(e) => setBookingForm({ ...bookingForm, quantity: parseInt(e.target.value) })} required />
              <label style={styles.label}>Start Date</label>
              <input style={styles.input} type="date" value={bookingForm.startDate}
                onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })} required />
              <label style={styles.label}>End Date</label>
              <input style={styles.input} type="date" value={bookingForm.endDate}
                onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })} required />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button style={styles.btnPrimary} type="submit">Submit Request</button>
                <button style={styles.btnSecondary} type="button" onClick={() => setBookingAsset(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '28px 32px', backgroundColor: '#f4f1ea', minHeight: '100vh',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px',
    gap: '16px', flexWrap: 'wrap' },
  heading: { fontSize: '26px', color: '#1f2937', margin: 0, fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' },
  card: { backgroundColor: '#fffdf8', padding: '22px', borderRadius: '8px',
    boxShadow: '0 10px 28px rgba(17,24,39,0.07)', border: '1px solid #e7dfd2' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' },
  category: { fontSize: '12px', color: '#0f766e', fontWeight: '800', textTransform: 'uppercase' },
  badge: { fontSize: '12px', padding: '4px 9px', borderRadius: '999px', fontWeight: '700',
    border: '1px solid rgba(17,24,39,0.06)' },
  assetName: { fontSize: '18px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700' },
  desc: { fontSize: '14px', color: '#6b7280', marginBottom: '10px', lineHeight: 1.5 },
  quantity: { fontSize: '14px', color: '#4b5563', marginBottom: '14px' },
  cardActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  formCard: { backgroundColor: '#fffdf8', padding: '22px', borderRadius: '8px', marginBottom: '18px',
    boxShadow: '0 10px 28px rgba(17,24,39,0.07)', border: '1px solid #e7dfd2' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' },
  input: { width: '100%', padding: '11px 12px', border: '1px solid #d8d2c7', borderRadius: '7px',
    fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px', backgroundColor: '#fffaf0',
    color: '#111827', outlineColor: '#0f766e' },
  label: { fontSize: '13px', color: '#6b7280', marginBottom: '5px', display: 'block', fontWeight: '600' },
  btnPrimary: { backgroundColor: '#0f766e', color: 'white', border: '1px solid #0b5f59',
    padding: '9px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
  btnDanger: { backgroundColor: '#b91c1c', color: 'white', border: '1px solid #991b1b',
    padding: '9px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
  btnSecondary: { backgroundColor: '#ebe4d8', color: '#1f2937', border: '1px solid #d8d2c7',
    padding: '9px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
  message: { backgroundColor: '#ecfdf5', color: '#047857', padding: '12px 14px', borderRadius: '7px',
    marginBottom: '18px', cursor: 'pointer', border: '1px solid #a7f3d0', fontWeight: '600' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17,24,39,0.56)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' },
  modal: { backgroundColor: '#fffdf8', padding: '32px', borderRadius: '8px', width: '100%',
    maxWidth: '420px', border: '1px solid #e7dfd2', boxShadow: '0 24px 70px rgba(17,24,39,0.24)' }
}

export default Assets
