
const mongoose = require('mongoose');

const feeRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  term: {
    type: String,
    required: true
  },
  totalDue: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid'],
    default: 'Unpaid'
  }
}, { timestamps: true });

// Auto-update balance and status before save
feeRecordSchema.pre('save', function (next) {
  this.balance = this.totalDue - this.amountPaid;

  if (this.amountPaid === 0) this.status = 'Unpaid';
  else if (this.amountPaid < this.totalDue) this.status = 'Partial';
  else this.status = 'Paid';

  next();
});

module.exports = mongoose.model('FeeRecord', feeRecordSchema);
