const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createBooking = async (req, res) => {
  try {
    const { assetId, quantity, startDate, endDate } = req.body
    const asset = await prisma.asset.findUnique({ where: { id: parseInt(assetId) } })
    if (!asset) return res.status(404).json({ message: 'Asset not found' })
    if (asset.available < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' })
    }
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        assetId: parseInt(assetId),
        quantity: parseInt(quantity),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    })
    res.status(201).json(booking)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, email: true } }, asset: true }
    })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const myBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { asset: true }
    })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (status === 'APPROVED') {
      await prisma.asset.update({
        where: { id: booking.assetId },
        data: { available: { decrement: booking.quantity } }
      })
    }
    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status }
    })
    await prisma.auditLog.create({
      data: { userId: req.user.id, action: `BOOKING_${status}`, details: `Booking ID: ${id}` }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const returnAsset = async (req, res) => {
  try {
    const { id } = req.params
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    await prisma.asset.update({
      where: { id: booking.assetId },
      data: { available: { increment: booking.quantity } }
    })
    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: 'RETURNED', returnedAt: new Date() }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { createBooking, getAllBookings, myBookings, updateBookingStatus, returnAsset }