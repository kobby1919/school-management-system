const mongoose = require('mongoose');

const paymentLogSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  term: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Mobile Money', 'Cheque'],
    required: true
  },
  reference: String,
  date: {
    type: Date,
    default: Date.now
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher' 
  },
  feeRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeRecord'
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentLog', paymentLogSchema);
