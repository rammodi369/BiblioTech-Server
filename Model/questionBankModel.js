const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'True/False', 'Descriptive'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: [{
    type: String,
  }],
  options: [{
    type: String,
  }],
  answer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
