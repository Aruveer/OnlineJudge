const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    default: ''
  },
  starterCode: {
    type: String,
    default: '// Write your solution here\n'
  },
  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true }
    }
  ],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: [{
    type: String,
  }],
  timeLimit: {
    type: Number,
    required: true,
    default: 1.0, // seconds
  },
  memoryLimit: {
    type: Number,
    required: true,
    default: 256, // MB
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);
