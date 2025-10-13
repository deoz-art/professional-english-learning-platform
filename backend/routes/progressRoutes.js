const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProgress, completeLevel } = require('../controllers/progressController');

router.use(protect);

router.get('/', getProgress);
router.post('/complete-level', completeLevel);

module.exports = router;