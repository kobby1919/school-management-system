
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true},
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date, required: true },
  address: String,
  guardianName: String,
  guardianContact: String,

  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },

  academicHistory: [{
    term: String,
    year: String,
    performance: String // summary or report reference
  }],

  attendanceRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentAttendance'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
