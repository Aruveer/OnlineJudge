const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');

const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'], // Frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('OnlineJudge API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
