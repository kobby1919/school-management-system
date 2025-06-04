const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  level: {
    type: String, 
    enum: ["Lower Primary", "Upper Primary", "JHS", "All"],
    default: "All"
  },
  group: {
    type: String,
    enum: ["General", "Lower Primary", "Upper Primary", "JHS"], 
    required: true
  },
  description: String
}, { timestamps: true });

subjectSchema.index({ name: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
