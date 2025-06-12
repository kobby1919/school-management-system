const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  // subjects: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Subject'
  // }]
}, { timestamps: true });

classSchema.index({ name: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
