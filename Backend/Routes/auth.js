const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/dataStore');
// Change this line to match the actual filename
const { authenticateToken, JWT_SECRET } = require('../middleware/authenticationToken');

const router = express.Router();
const usersFile = 'data/users.json';

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email and password are required' } });

    const users = readData(usersFile, []);
    if (users.find(u => u.email === email))
      return res.status(400).json({ error: { code: 'USER_EXISTS', message: 'User already exists' } });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), email, password: hashedPassword };
    users.push(newUser);
    writeData(usersFile, users);

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

    const users = readData(usersFile, []);
    const user = users.find(u => u.email === email);
    if (!user)
      return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;