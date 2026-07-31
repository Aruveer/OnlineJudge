const AuthUser = require('../models/authUser');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await AuthUser.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await AuthUser.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);

      // Send token in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await AuthUser.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      // Send token in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(200).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'User logged out successfully' });
};


// @desc    Get dashboard stats
// @route   GET /api/auth/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalProblems = await Problem.countDocuments();
    let totalUsers = null;

    if (req.user && req.user.role === 'admin') {
      totalUsers = await AuthUser.countDocuments();
    }

    const solvedProblemsData = await Submission.aggregate([
      { $match: { userId: req.user._id, verdict: 'Accepted' } },
      { $group: { _id: '$problemId' } },
      { $count: 'solvedProblems' }
    ]);
    
    const solvedProblems = solvedProblemsData.length > 0 ? solvedProblemsData[0].solvedProblems : 0;

    // Aggregate difficulty data
    const difficultyStatsRaw = await Submission.aggregate([
      { $match: { userId: req.user._id, verdict: 'Accepted' } },
      { $group: { _id: '$problemId' } },
      { $lookup: {
          from: 'problems',
          localField: '_id',
          foreignField: '_id',
          as: 'problem'
      }},
      { $unwind: '$problem' },
      { $group: { _id: '$problem.difficulty', count: { $sum: 1 } } }
    ]);

    // Format difficulty data for Recharts (Easy, Medium, Hard)
    const difficultyData = [
      { name: 'Easy', value: 0, color: '#10b981' },
      { name: 'Medium', value: 0, color: '#f59e0b' },
      { name: 'Hard', value: 0, color: '#ef4444' }
    ];

    difficultyStatsRaw.forEach(stat => {
      const index = difficultyData.findIndex(d => d.name === stat._id);
      if (index !== -1) {
        difficultyData[index].value = stat.count;
      }
    });

    // Aggregate activity data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const activityStatsRaw = await Submission.aggregate([
      { $match: { 
          userId: req.user._id, 
          verdict: 'Accepted',
          createdAt: { $gte: sevenDaysAgo }
      }},
      { $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          solved: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Format activity data to ensure all 7 days are present
    const activityData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      
      const stat = activityStatsRaw.find(s => s._id === dateStr);
      activityData.push({
        name: dayName,
        solved: stat ? stat.solved : 0
      });
    }

    res.status(200).json({
      totalProblems,
      solvedProblems,
      difficultyData,
      activityData,
      ...(totalUsers !== null && { totalUsers })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await AuthUser.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await AuthUser.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getStats,
  updateProfile,
  getAllUsers
};
