const StudyMaterial = require('../Model/studyMaterial');
const { uploadFileToS3 } = require('../Middlewares/s3Service');

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, subject, description, Category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const s3Url = await uploadFileToS3(req.file);

    const newMaterial = new StudyMaterial({
      title,
      subject,
      Category,
      description,
      fileUrl: s3Url,
      fileType: req.file.mimetype.split('/')[1],
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload material', error: error.message });
  }
};

// Get all study materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch materials', error: error.message });
  }
};

// Get single study material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching material', error: error.message });
  }
};

// Delete study material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    await material.deleteOne();
    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete material', error: error.message });
  }
};
