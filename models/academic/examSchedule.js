const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true // format: "09:00"
  },
  endTime: {
    type: String,
    required: true // format: "10:00"
  }
}, { timestamps: true });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
