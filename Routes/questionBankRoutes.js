const express = require('express');
const {
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../Controllers/questionBankController');
const { protect, librarian } = require('../Middlewares/authMiddleware');

const router = express.Router();

// Routes for question bank
router.route('/')
  .post(protect, librarian, addQuestion) // Only librarian can add questions
  .get(protect, getQuestions); // Anyone can get questions with filters

router.route('/:id')
  .get(protect, getQuestion) // Anyone can get a specific question
  .put(protect, librarian, updateQuestion) // Only librarian can update questions
  .delete(protect, librarian, deleteQuestion); // Only librarian can delete questions

module.exports = router;
