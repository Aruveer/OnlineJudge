const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getStats, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/stats', protect, getStats);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
