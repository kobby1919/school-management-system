const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
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
    enum: ['Present', 'Absent'],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
