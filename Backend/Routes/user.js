const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/authenticationToken');
const User = require('../models/User');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ id: user._id, email: user.email });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    if (!updatedUser)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;