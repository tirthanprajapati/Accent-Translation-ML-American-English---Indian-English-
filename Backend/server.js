const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db'); // new addition

const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/user');
const convertRoutes = require('./Routes/convert');
const historyRoutes = require('./Routes/history');
const audioRoutes = require('./Routes/audio');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many requests, please try again later.'
    }
  }
});
app.use(limiter);

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/audio', audioRoutes);

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});