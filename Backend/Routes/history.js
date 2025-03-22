const express = require('express');
const { authenticateToken } = require('../middleware/authenticationToken');
const { readData, writeData } = require('../utils/dataStore');

const router = express.Router();
const conversionsFile = 'data/conversions.json';

// GET /api/history - with pagination
router.get('/', authenticateToken, (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const allConversions = readData(conversionsFile, []).filter(c => c.userId === req.user.id);
    const totalCount = allConversions.length;
    const conversions = allConversions.slice((page - 1) * limit, page * limit);
    res.json({ conversions, totalCount });
  } catch (error) {
    next(error);
  }
});

// GET /api/history/:id
router.get('/:id', authenticateToken, (req, res, next) => {
  try {
    const conversions = readData(conversionsFile, []);
    const conversion = conversions.find(c => c.id === req.params.id && c.userId === req.user.id);
    if (!conversion)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Conversion not found' } });
    res.json(conversion);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/history/:id
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    let conversions = readData(conversionsFile, []);
    const index = conversions.findIndex(c => c.id === req.params.id && c.userId === req.user.id);
    if (index === -1)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Conversion not found' } });
    conversions.splice(index, 1);
    writeData(conversionsFile, conversions);
    res.json({ message: 'Conversion record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;