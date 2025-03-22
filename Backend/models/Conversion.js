const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalAudio: { type: String, required: true },
  convertedAudio: { type: String },
  targetAccent: { type: String, required: true },
  status: { type: String, default: 'processing' },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Conversion', ConversionSchema);