const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllAssets = async (req, res) => {
  try {
    const { category, search } = req.query
    let where = {}
    if (category) where.category = category
    if (search) where.name = { contains: search, mode: 'insensitive' }

    const assets = await prisma.asset.findMany({ where })
    res.json(assets)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const createAsset = async (req, res) => {
  try {
    const { name, category, description, quantity } = req.body
    const asset = await prisma.asset.create({
      data: { name, category, description, quantity, available: quantity }
    })

    await prisma.auditLog.create({
      data: { userId: req.user.id, action: 'ASSET_CREATED', details: `Asset: ${name}` }
    })

    res.status(201).json(asset)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, description, quantity, status } = req.body
    const asset = await prisma.asset.update({
      where: { id: parseInt(id) },
      data: { name, category, description, quantity, status }
    })
    res.json(asset)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.asset.delete({ where: { id: parseInt(id) } })
    res.json({ message: 'Asset deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { getAllAssets, createAsset, updateAsset, deleteAsset }