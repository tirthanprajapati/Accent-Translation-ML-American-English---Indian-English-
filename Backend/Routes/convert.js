const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/authenticationToken');
const Conversion = require('../models/Conversion');

const router = express.Router();

// GET /api/convert/accents
router.get('/accents', authenticateToken, (req, res, next) => {
  try {
    const accents = [
      { id: 'american', name: 'American', description: 'Standard American accent' },
      { id: 'indian', name: 'Indian', description: 'Indian English accent' }
    ];
    res.json({ accents });
  } catch (error) {
    next(error);
  }
});

// Set up storage for uploaded audio files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure the uploads folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit

// POST /api/convert
router.post('/', authenticateToken, upload.single('audio'), async (req, res, next) => {
  try {
    const targetAccent = req.query.targetAccent;
    if (!targetAccent)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'targetAccent query parameter is required' } });

    if (!req.file)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Audio file is required' } });

    // Create a new conversion record in MongoDB
    const newConversion = await Conversion.create({
      userId: req.user.id,
      originalAudio: req.file.path,
      convertedAudio: null,
      targetAccent,
      status: 'processing',
      progress: 0
    });

    // Simulate conversion process update
    setTimeout(async () => {
      try {
        const conversion = await Conversion.findById(newConversion._id);
        if (conversion) {
          conversion.status = 'completed';
          conversion.progress = 100;
          // In a real scenario, update convertedAudio with the actual converted file path.
          conversion.convertedAudio = req.file.path;
          await conversion.save();
        }
      } catch (err) {
        console.error('Error updating conversion simulation', err);
      }
    }, 5000);

    res.json({ id: newConversion._id, status: 'processing', message: 'Conversion started' });
  } catch (error) {
    next(error);
  }
});

// GET /api/convert/:id
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

module.exports = router;