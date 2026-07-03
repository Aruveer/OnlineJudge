const Problem = require('../models/problem');
const TestCase = require('../models/testCase');

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).select('title difficulty tags timeLimit memoryLimit');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single problem with sample test cases
// @route   GET /api/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (problem) {
      // Fetch only sample test cases for the problem page
      const testCases = await TestCase.find({ problemId: problem._id, isSample: true }).select('input expectedOutput');
      
      res.json({
        ...problem.toObject(),
        testCases
      });
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a problem
// @route   POST /api/problems
// @access  Private
const createProblem = async (req, res) => {
  try {
    const { title, statement, difficulty, tags, timeLimit, memoryLimit, testCases } = req.body;

    const problem = new Problem({
      title,
      statement,
      difficulty,
      tags,
      timeLimit,
      memoryLimit,
      createdBy: req.user._id,
    });

    const createdProblem = await problem.save();

    // If test cases are provided, save them as well
    if (testCases && testCases.length > 0) {
      const testCasesToInsert = testCases.map(tc => ({
        ...tc,
        problemId: createdProblem._id
      }));
      await TestCase.insertMany(testCasesToInsert);
    }

    res.status(201).json(createdProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = async (req, res) => {
  try {
    const { title, statement, difficulty, tags, timeLimit, memoryLimit } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (problem) {
      problem.title = title || problem.title;
      problem.statement = statement || problem.statement;
      problem.difficulty = difficulty || problem.difficulty;
      problem.tags = tags || problem.tags;
      problem.timeLimit = timeLimit || problem.timeLimit;
      problem.memoryLimit = memoryLimit || problem.memoryLimit;

      const updatedProblem = await problem.save();
      res.json(updatedProblem);
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (problem) {
      // Delete associated test cases first
      await TestCase.deleteMany({ problemId: problem._id });
      // Delete the problem itself using deleteOne instead of remove
      await Problem.deleteOne({ _id: problem._id });
      res.json({ message: 'Problem removed' });
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
};
