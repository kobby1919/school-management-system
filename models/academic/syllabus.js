const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String
  },
  weeklyOutline: [{
    week: Number,
    topic: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);
