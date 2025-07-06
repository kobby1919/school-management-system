const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['Announcement', 'PTA', 'Holiday'],
    default: 'Announcement'
  },
  date: {
    type: Date,
    default: Date.now
  },
  visibleTo: {
    type: [String],
    enum: ['parents', 'students', 'both'],
    default: ['both']
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
