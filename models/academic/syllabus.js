const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  term: { type: String, required: true }, 
  academicYear: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);
