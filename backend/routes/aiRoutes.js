const express = require('express');
const router = express.Router();
const { chat, hint, review } = require('../controllers/aiController');

// In a real app, hint and review might use authMiddleware to ensure only logged-in users get them,
// but for simplicity here, we'll keep them open or assume auth is handled globally/similarly.

router.post('/chat', chat);
router.post('/hint', hint);
router.post('/review', review);

module.exports = router;
