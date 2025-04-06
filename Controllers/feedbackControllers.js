const Feedback = require('../Model/feedbackModel');
const User = require('../Model/userModel');

// Get all feedback (GET /api/feedback)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('user', 'username'); // Populate user information
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFeedback = async (req, res) => {
  // console.log('I am here 1.')
  const { subject, message } = req.body;
  const userId = req.user._id; // Assuming user ID is stored in req.user from middleware

  try {
    const newFeedback = new Feedback({
      user: userId,
      subject,
      message,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    // console.log('I am here.')
    res.status(500).json({ message: error.message });
  }
};
