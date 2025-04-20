const express = require('express');
const {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getBookHistory,
  getBooksByIds,
  getCompleteBooksHistory
} = require('../Controllers/bookControllers');
const { protect, librarian,authorize } = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/upload'); 

const router = express.Router();


// Crud operations  on books by librarian and fetching books data by students.
  // router.route('/')
  //   .post(protect, librarian, addBook)
  //   .get(protect, getBooks);
  router.route('/')
  .post(protect, librarian, upload.single('pdf'), addBook) // Add upload.single('pdf') here
  .get(protect, getBooks);

router.route('/:id')
  .get(protect, getBook)
  .put(protect, librarian, updateBook)
  .delete(protect, librarian, deleteBook);

router.route('/by-ids').post(protect, getBooksByIds);
router.get('/history/borrowing',protect, authorize('admin', 'librarian'),getCompleteBooksHistory);
router.get('/history/:bookId', protect, authorize('admin', 'librarian'), getBookHistory);


module.exports = router;
