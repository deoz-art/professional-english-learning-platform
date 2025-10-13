const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserProgress,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/progress/:userId', getUserProgress);

module.exports = router;