const Problem = require('../models/problem');
const TestCase = require('../models/testCase');
const Submission = require('../models/submission');

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
      // The testCases are embedded in the Problem schema directly
      res.json(problem);
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
    const { title, description, constraints, difficulty, tags, timeLimit, memoryLimit, testCases } = req.body;

    const problem = new Problem({
      title,
      description,
      constraints,
      difficulty,
      tags,
      timeLimit,
      memoryLimit,
      createdBy: req.user._id,
      testCases,
    });

    const createdProblem = await problem.save();

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
    const { title, description, constraints, difficulty, tags, timeLimit, memoryLimit, testCases } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (problem) {
      problem.title = title || problem.title;
      problem.description = description || problem.description;
      if (constraints !== undefined) problem.constraints = constraints;
      problem.difficulty = difficulty || problem.difficulty;
      problem.tags = tags || problem.tags;
      problem.timeLimit = timeLimit || problem.timeLimit;
      problem.memoryLimit = memoryLimit || problem.memoryLimit;
      if (testCases) problem.testCases = testCases;

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

// @desc    Run code with custom input
// @route   POST /api/problems/run
// @access  Private
const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const compilerUrl = process.env.COMPILER_URL || 'http://localhost:5001';
    
    const compilerResponse = await fetch(`${compilerUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, language, input })
    });

    const data = await compilerResponse.json();

    if (!compilerResponse.ok) {
      return res.status(400).json({ message: data.error || 'Execution Error', details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with compiler service', error: error.message });
  }
};

// @desc    Submit code against test cases
// @route   POST /api/problems/:id/submit
// @access  Private
const submitCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problemId = req.params.id;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({ message: 'No test cases defined for this problem' });
    }

    const compilerUrl = process.env.COMPILER_URL || 'http://localhost:5001';
    let passed = 0;
    let results = [];

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      // Format the input correctly (it might just be raw strings in the DB now, or JSON arrays)
      // Since our new Two Sum seed script saves input as "[2,7,11,15]\n9", we'll just pass it as string input!
      const inputStr = tc.input;
      
      const compilerResponse = await fetch(`${compilerUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, input: inputStr })
      });

      const data = await compilerResponse.json();
      
      if (!compilerResponse.ok) {
        results.push(`Test ${i + 1}: ERROR (${data.error || 'Execution failed'})`);
        continue;
      }

      // Very simple string match for MVP
      const output = (data.output || '').trim();
      const expected = tc.expectedOutput.trim();

      if (output === expected) {
        passed++;
        results.push(`Test ${i + 1}: PASS`);
      } else {
        results.push(`Test ${i + 1}: FAIL (Expected: ${expected}, Got: ${output})`);
      }
    }

    let verdict = 'Wrong Answer';
    if (results.some(r => r.includes('ERROR'))) {
      verdict = 'Runtime Error';
    } else if (passed === problem.testCases.length) {
      verdict = 'Accepted';
    }

    // Save submission to database
    const submission = new Submission({
      userId: req.user._id,
      problemId: problem._id,
      code,
      language,
      verdict,
      passedCount: passed,
      totalTestCases: problem.testCases.length
    });
    await submission.save();

    res.status(200).json({ 
      output: results.join('\n') + `\n\nResult: ${passed}/${problem.testCases.length} Passed`,
      verdict
    });
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with compiler service', error: error.message });
  }
};

// @desc    Get user submissions for a specific problem
// @route   GET /api/problems/:id/submissions
// @access  Private
const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      problemId: req.params.id, 
      userId: req.user._id 
    }).sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

// @desc    Get global leaderboard
// @route   GET /api/problems/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // We want to find the number of UNIQUE problems solved by each user (verdict: 'Accepted')
    const leaderboard = await Submission.aggregate([
      { $match: { verdict: 'Accepted' } },
      { $group: {
          _id: { userId: '$userId', problemId: '$problemId' },
          lastAccepted: { $max: '$createdAt' }
      }},
      { $group: {
          _id: '$_id.userId',
          problemsSolved: { $sum: 1 },
          lastAcceptedSubmission: { $max: '$lastAccepted' }
      }},
      { $lookup: {
          from: 'authusers',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
          _id: 1,
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          problemsSolved: 1,
          lastAcceptedSubmission: 1
      }},
      { $sort: { problemsSolved: -1, lastAcceptedSubmission: 1 } }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  submitCode,
  runCode,
  getUserSubmissions,
  getLeaderboard
};
