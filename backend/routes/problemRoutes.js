const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for reading problems
router.get('/', getProblems);
router.get('/:id', getProblemById);

// Protected routes for modifying problems (Open to all authenticated users for demo)
router.post('/', protect, createProblem);
router.put('/:id', protect, updateProblem);
router.delete('/:id', protect, deleteProblem);

module.exports = router;
