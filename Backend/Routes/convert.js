const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/authenticationToken');
const { readData, writeData } = require('../utils/dataStore');

const router = express.Router();
const conversionsFile = 'data/conversions.json';

// GET /api/convert/accents
router.get('/accents', authenticateToken, (req, res, next) => {
  try {
    const accents = [
      { id: 'american', name: 'American', description: 'Standard American accent' },
      { id: 'british', name: 'British', description: 'Received Pronunciation' },
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
    cb(null, 'uploads/'); // Make sure the uploads folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit

// POST /api/convert
router.post('/', authenticateToken, upload.single('audio'), (req, res, next) => {
  try {
    const targetAccent = req.query.targetAccent;
    if (!targetAccent)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'targetAccent query parameter is required' } });

    if (!req.file)
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Audio file is required' } });

    const conversions = readData(conversionsFile, []);
    const newConversion = {
      id: Date.now().toString(),
      userId: req.user.id,
      originalAudio: req.file.path,
      convertedAudio: null,
      targetAccent,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    conversions.push(newConversion);
    writeData(conversionsFile, conversions);

    // Simulate a conversion process update
    setTimeout(() => {
      let updatedConversions = readData(conversionsFile, []);
      const idx = updatedConversions.findIndex(c => c.id === newConversion.id);
      if (idx !== -1) {
        updatedConversions[idx].status = 'completed';
        updatedConversions[idx].progress = 100;
        // In a real scenario, update convertedAudio with the actual converted file path.
        updatedConversions[idx].convertedAudio = req.file.path;
        writeData(conversionsFile, updatedConversions);
      }
    }, 5000);

    res.json({ id: newConversion.id, status: 'processing', message: 'Conversion started' });
  } catch (error) {
    next(error);
  }
});

// GET /api/convert/:id
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

module.exports = router;