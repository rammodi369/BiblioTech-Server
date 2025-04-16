// const multer = require('multer');
// const path = require('path');

// const storage = multer.memoryStorage();
//   // const storage = multer.diskStorage({
//   //   destination: (req, file, cb) => {
//   //     cb(null, 'uploads/'); // Store PDFs in an 'uploads' folder
//   //   },
//   //   filename: (req, file, cb) => {
//   //     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   //   },
//   // });

// const upload = multer({ storage });

// module.exports = upload;
const multer = require('multer');
const path = require('path');

console.log('Configuring multer...');
// Configure storage
const storage = multer.memoryStorage();

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  console.log('Checking file type for:', file.originalname);
  if (file.mimetype === 'application/pdf') {
    console.log('PDF file accepted');
    cb(null, true);
  } else {
    console.log('Rejected file type:', file.mimetype);
    cb(new Error('Only PDF files are allowed'), false);
  }
};
// Create upload instance with 100MB limit
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100 // 100MB limit (100 * 1024 * 1024 bytes)
  }
});

console.log('Multer configured with 100MB file size limit');

module.exports = upload;