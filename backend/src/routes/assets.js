const express = require('express')
const router = express.Router()
const { authenticate, isAdmin } = require('../middleware/auth')
const {
  getAllAssets,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController')

router.get('/', authenticate, getAllAssets)
router.post('/', authenticate, isAdmin, createAsset)
router.put('/:id', authenticate, isAdmin, updateAsset)
router.delete('/:id', authenticate, isAdmin, deleteAsset)

module.exports = router