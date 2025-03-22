const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/authenticationToken');
const { readData, writeData } = require('../utils/dataStore');

const router = express.Router();
const usersFile = 'data/users.json';

// GET /api/users/profile
router.get('/profile', authenticateToken, (req, res, next) => {
  try {
    const users = readData(usersFile, []);
    const user = users.find(u => u.id === req.user.id);
    if (!user)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let users = readData(usersFile, []);
    const index = users.findIndex(u => u.id === req.user.id);
    if (index === -1)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    
    if (email) users[index].email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      users[index].password = hashedPassword;
    }
    writeData(usersFile, users);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;