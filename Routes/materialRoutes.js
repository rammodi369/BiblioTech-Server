const express = require('express');
const {
  uploadMaterial,
  getAllMaterials,
  getMaterialById,
  deleteMaterial,
} = require('../Controllers/studyMaterialController');

const { protect, authorize } = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/upload'); // For handling file uploads

const router = express.Router();

// Upload study material (any file type) – accessible by librarian or admin
router.post('/', protect, authorize('admin', 'librarian'), upload.single('file'), uploadMaterial);

// Get all study materials – accessible to all authenticated users
router.get('/', protect, getAllMaterials);

// Get a single material by ID
router.get('/:id', protect, getMaterialById);

// Delete a study material
//router.delete('/:id', protect, authorize('admin', 'librarian'), deleteMaterial);

module.exports = router;
