const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../Middlewares/authMiddleware');
const FeedbackController = require('../Controllers/feedbackControllers');


// GET all feedback (admin access)
router.get('/', protect, authorize('admin', 'librarian'), FeedbackController.getAllFeedback);

// POST create feedback (authenticated user)
router.post('/', protect, FeedbackController.createFeedback);


module.exports = router;
