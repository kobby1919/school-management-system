const mongoose = require('mongoose');

const attendanceAuditSchema = new mongoose.Schema({
  attendanceRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'studentAttendance',
    required: true
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // or Admin who edited
    required: true
  },
  oldStatus: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true
  },
  newStatus: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true
  },
  oldRemark: {
    type: String,
    default: ''
  },
  newRemark: {
    type: String,
    default: ''
  },
  editedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceAudit', attendanceAuditSchema);
