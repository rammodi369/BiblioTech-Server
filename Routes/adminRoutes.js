const express = require('express');
const router = express.Router();
const { protect, authorize, librarian } = require('../Middlewares/authMiddleware');
const UserController = require('../Controllers/userController');
const BookController = require('../Controllers/bookControllers');
const RequestController = require('../Controllers/bookRequestControllers');
const DashboardController = require('../Controllers/dashboard.controllers');
const QuestionBankController = require('../Controllers/questionBankController');

// Admin & Librarian routes for User Management
router.get('/users', protect, authorize('admin', 'librarian'), UserController.getAllUsers);
router.get('/users/:userId', protect, authorize('admin', 'librarian'), UserController.getUserById);
router.patch('/users/:userId', protect, authorize('admin'), UserController.updateUser);
router.delete('/users/:userId', protect, authorize('admin'), UserController.deleteUser);

// Admin-only routes for Book Management
router.get('/books', protect, authorize('admin'), BookController.getBooks);
router.post('/books', protect, authorize('admin'), BookController.addBook);
router.get('/books/:bookId', protect, authorize('admin'), BookController.getBook);
router.patch('/books/:bookId', protect, authorize('admin'), BookController.updateBook);
router.delete('/books/:bookId', protect, authorize('admin'), BookController.deleteBook);

// Admin & Librarian routes for Book Request Management
router.get('/requests', protect, authorize('admin', 'librarian'), RequestController.getAllRequests);
router.patch('/requests/:requestId', protect, authorize('admin', 'librarian'), RequestController.respondToRequest);

// Admin & Librarian routes for Dashboard Stats
router.get('/dashboard/stats', protect, authorize('admin', 'librarian'), DashboardController.getDashboardStats);

// Question Bank Routes
router.get('/questions', protect, QuestionBankController.getQuestions); // Anyone can fetch questions
router.get('/questions/:id', protect, QuestionBankController.getQuestion); // Anyone can fetch a specific question
router.post('/questions', protect, librarian, QuestionBankController.addQuestion); // Only librarian can add questions
router.patch('/questions/:id', protect, librarian, QuestionBankController.updateQuestion); // Only librarian can update questions
router.delete('/questions/:id', protect, librarian, QuestionBankController.deleteQuestion); // Only librarian can delete questions

module.exports = router;
