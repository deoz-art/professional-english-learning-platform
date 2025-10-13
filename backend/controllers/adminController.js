const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Level = require('../models/Level');
const Progress = require('../models/Progress');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    // Total users (students only)
    const totalUsers = await User.countDocuments({ role: 'student' });

    // Total levels
    const totalLevels = await Level.countDocuments();

    // Calculate average score across all users
    const progressData = await Progress.find().populate('user');
    
    let totalScore = 0;
    let scoreCount = 0;
    let completedCount = 0;

    progressData.forEach((progress) => {
      progress.levelProgress.forEach((level) => {
        if (level.highScore > 0) {
          totalScore += level.highScore;
          scoreCount++;
        }
        if (level.status === 'completed') {
          completedCount++;
        }
      });
    });

    const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const completionRate = totalLevels > 0 && totalUsers > 0 
      ? Math.round((completedCount / (totalLevels * totalUsers)) * 100) 
      : 0;

    // Get user registrations over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.find({
      createdAt: { $gte: thirtyDaysAgo },
      role: 'student',
    }).select('createdAt');

    // Group by date
    const registrationsByDate = {};
    recentUsers.forEach((user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      registrationsByDate[date] = (registrationsByDate[date] || 0) + 1;
    });

    const registrationData = Object.keys(registrationsByDate)
      .sort()
      .map((date) => ({
        date,
        registrations: registrationsByDate[date],
      }));

    // Performance per level
    const levels = await Level.find().sort({ levelNumber: 1 });
    const performanceData = [];

    for (const level of levels) {
      const levelProgress = await Progress.find({
        'levelProgress.levelNumber': level.levelNumber,
      });

      let levelTotalScore = 0;
      let levelScoreCount = 0;

      levelProgress.forEach((progress) => {
        const levelData = progress.levelProgress.find(
          (lp) => lp.levelNumber === level.levelNumber
        );
        if (levelData && levelData.highScore > 0) {
          levelTotalScore += levelData.highScore;
          levelScoreCount++;
        }
      });

      performanceData.push({
        level: `Level ${level.levelNumber}`,
        avgScore: levelScoreCount > 0 ? Math.round(levelTotalScore / levelScoreCount) : 0,
      });
    }

    res.json({
      kpis: {
        totalUsers,
        totalLevels,
        avgScore,
        completionRate,
      },
      registrationData,
      performanceData,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

// @desc    Get all users (paginated, searchable, sortable)
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = search
      ? { username: { $regex: search, $options: 'i' } }
      : {};

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Admin
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'student',
    });

    // Create progress document for student
    if (user.role === 'student') {
      const levels = await Level.find().sort({ levelNumber: 1 });
      const levelProgress = levels.map((level, index) => ({
        levelNumber: level.levelNumber,
        status: index === 0 ? 'unlocked' : 'locked',
        highScore: 0,
      }));

      await Progress.create({
        user: user._id,
        levelProgress,
      });
    }

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:userId
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password, role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username) {
      // Check if new username already exists
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.username = username;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated progress
    await Progress.deleteOne({ user: userId });

    // Delete user
    await User.deleteOne({ _id: userId });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// @desc    Get user progress
// @route   GET /api/admin/progress/:userId
// @access  Admin
const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await Progress.findOne({ user: userId }).populate('user', 'username');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ message: 'Error fetching user progress' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserProgress,
};