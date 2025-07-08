const mongoose = require('mongoose');
const StudentAttendance = require('./studentAttendance');
const FeeRecord = require('../finance/feeRecord');
const PaymentLog = require('../finance/paymentLog');
const Parent = require('../parent/parent');

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

studentSchema.pre('findOneAndDelete', async function (next) {
  const studentId = this.getQuery()['_id'];

  // Delete attendance records
  await StudentAttendance.deleteMany({ student: studentId });

  // Delete fee records and payments
  await FeeRecord.deleteMany({ student: studentId });
  await PaymentLog.deleteMany({ student: studentId });

  // Remove from parents
  await Parent.updateMany(
    { children: studentId },
    { $pull: { children: studentId } }
  );

  next();
});

module.exports = mongoose.model('Student', studentSchema);
