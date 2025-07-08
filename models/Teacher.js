const mongoose = require('mongoose');
const SubjectAllocation = require('../models/academic/subjectAllocation');
const Class = require('../models/academic/class');
const TeacherAttendance = require('../models/teacher/teacherAttendance');


const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin', 'teacher'],
    default: 'teacher'
  },

  qualifications: [
    {
      degree: String,
      institution: String,
      year: Number,
      documentUrl: String 
    }
  ],

  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null
  },

  assignedSubjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }
  ],

  profileImage: {
    type: String,
    default: ''
  }

}, { timestamps: true});


teacherSchema.pre('findOneAndDelete', async function (next) {
  try {
    const teacherId = this.getQuery()['_id'];

    // 1. Delete subject allocations
    await SubjectAllocation.deleteMany({ teacher: teacherId });

    // 2. Remove from classTeacher fields
    await Class.updateMany(
      { classTeacher: teacherId },
      { $set: { classTeacher: null } }
    );

    // 3. Delete teacher attendance records
    await TeacherAttendance.deleteMany({ teacher: teacherId });

    next();
  } catch (err) {
    console.error('❌ Error during teacher cleanup:', err);
    next(err);
  }
});


module.exports = mongoose.model('Teacher', teacherSchema,);
