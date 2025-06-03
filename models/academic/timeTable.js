const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: function () {
      return !this.isBreak;
    }
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: true
  },
  startTime: String,
  endTime: String,
  isBreak: {
    type: Boolean,
    default: false
  }
});

const timetableSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  term: {
    type: String,
    default: 'Term 1'
  },
  schedule: [timetableEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
