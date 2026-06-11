const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const assetRoutes = require('./routes/assets')
const bookingRoutes = require('./routes/bookings')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/bookings', bookingRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Asset Management API running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})