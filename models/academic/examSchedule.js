const mongoose = require('mongoose');

const examTimetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  term: { type: String, required: true },
  weekStartDate: { type: Date, required: true },
  schedule: [
    {
      day: { type: String, required: true }, // e.g., Monday
      exams: [
        {
          subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ExamTimetable', examTimetableSchema);
