const express = require('express');
const { authenticateToken } = require('../middleware/authenticationToken');
const Conversion = require('../models/Conversion');

const router = express.Router();

// GET /api/history - with pagination
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = { userId: req.user.id };
    const totalCount = await Conversion.countDocuments(query);
    const conversions = await Conversion.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.json({ conversions, totalCount });
  } catch (error) {
    next(error);
  }
});

// GET /api/history/:id
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const conversion = await Conversion.findOne({ _id: req.params.id, userId: req.user.id });
    if (!conversion)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Conversion not found' } });
    res.json(conversion);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/history/:id
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const conversion = await Conversion.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!conversion)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Conversion not found' } });
    res.json({ message: 'Conversion record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;