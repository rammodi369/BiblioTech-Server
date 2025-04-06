const Question = require('../Model/questionBankModel');

exports.addQuestion = async (req, res) => {
  const { question, type, difficulty, tags, options, answer } = req.body;
   console.log(req.body);
  try {
    const existingQuestion = await Question.findOne({ question });
    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already exists' });
    }

    const newQuestion = new Question({
      question,
      type,
      difficulty,
      tags,
      options,
      answer,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    console.log('Questions List:->'+questions);
    res.json(questions);
   // console.log(res.json(questions));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { question, type, difficulty, tags, options, answer } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, type, difficulty, tags, options, answer },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne({ _id: req.params.id });
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
