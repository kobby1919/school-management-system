const mongoose = require('mongoose');
const SubjectAllocation = require('./subjectAllocation');


const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  level: {
    type: String, 
    enum: [
      "Primary 1", 
      "Primary 2", 
      "Primary 3", 
      "Primary 4", 
      "Primary 5", 
      "Primary 6", 
      "JHS 1", 
      "JHS 2", 
      "JHS 3", 
      "All"],
    default: "All",
    required: true 
  },
  group: {
    type: String,
    enum: ["General", "Lower Primary", "Upper Primary", "JHS"], 
    required: true
  },
  description: String
}, { timestamps: true });

subjectSchema.pre('findOneAndDelete', async function (next) {
  const subjectId = this.getQuery()['_id'];
  await SubjectAllocation.deleteMany({ subject: subjectId });
  next();
});

subjectSchema.index({ name: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
