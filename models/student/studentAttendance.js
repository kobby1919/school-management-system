const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true,
  },
  remark: {
    type: String, // optional text
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('studentAttendance', studentAttendanceSchema);
