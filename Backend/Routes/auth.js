const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/authenticationToken');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email and password are required' } });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: { code: 'USER_EXISTS', message: 'User already exists' } });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email and password are required' } });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;