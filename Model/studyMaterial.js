const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  Category:{
    type: String,
  },
  description: {
    type: String,
  },
  fileUrl: {
    type: String, // This will store the link to the uploaded file (e.g., from AWS S3 or your server)
    required: true,
  },
  fileType: {
    type: String, // Optional: e.g., 'pdf', 'docx', 'pptx', 'zip'
  },
 
 
}, { timestamps: true });

const StudyMaterial = mongoose.model('StudyMaterial', StudyMaterialSchema);

module.exports = StudyMaterial;
