const express = require('express')
const router = express.Router()
const { authenticate, isAdmin } = require('../middleware/auth')
const {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  returnAsset,
  myBookings
} = require('../controllers/bookingController')

router.post('/', authenticate, createBooking)
router.get('/', authenticate, isAdmin, getAllBookings)
router.get('/my', authenticate, myBookings)
router.put('/:id/status', authenticate, isAdmin, updateBookingStatus)
router.put('/:id/return', authenticate, returnAsset)

module.exports = router