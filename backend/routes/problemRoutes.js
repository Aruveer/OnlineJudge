const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  submitCode,
  runCode
} = require('../controllers/problemController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes for reading problems
router.get('/', getProblems);
router.get('/:id', getProblemById);

// Protected routes for modifying problems (Admin only)
router.post('/', protect, authorize('admin'), createProblem);
router.put('/:id', protect, authorize('admin'), updateProblem);
router.delete('/:id', protect, authorize('admin'), deleteProblem);

// Route for executing code with custom input
router.post('/run', protect, runCode);

// Route for submitting code to the compiler
router.post('/:id/submit', protect, submitCode);

module.exports = router;
