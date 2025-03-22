const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/authenticationToken');

const router = express.Router();

// GET /api/audio/:id - Stream/download an audio file
router.get('/:id', authenticateToken, (req, res, next) => {
  try {
    // For simplicity, we assume the :id parameter is the relative file path.
    const filePath = path.join(__dirname, '..', req.params.id);
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Audio file not found' } });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/audio/:id - Delete an audio file
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '..', req.params.id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Audio file deleted successfully' });
    } else {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Audio file not found' } });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;