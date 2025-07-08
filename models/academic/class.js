const mongoose = require('mongoose');
const SubjectAllocation = require('./subjectAllocation');
const Timetable = require('./timeTable');
const AssessmentReport = require('../teacher/AssessmentReport');
const ExamSchedule = require('./examSchedule');

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

classSchema.pre('findOneAndDelete', async function (next) {
  const classId = this.getQuery()['_id'];

  try {
    await SubjectAllocation.deleteMany({ class: classId });
    await Timetable.deleteMany({ class: classId });
    await AssessmentReport.deleteMany({ class: classId });
    await ExamSchedule.deleteMany({ class: classId });

    console.log(`🧹 Cleanup complete for class ${classId}`);
    next();
  } catch (err) {
    console.error('❌ Error during class cleanup:', err);
    next(err);
  }
});

module.exports = mongoose.model('Class', classSchema);
