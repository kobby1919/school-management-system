const mongoose = require('mongoose');

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

module.exports = mongoose.model('Teacher', teacherSchema,);
