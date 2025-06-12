const mongoose = require('mongoose');

const assessmentReportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  term: {
    type: String,
    required: true
  },
  continuousAssessment: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  examScore: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  performanceReport: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  grade: {
    type: String
  }  
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

assessmentReportSchema.index(
    { student: 1, class: 1, term: 1 },
    { unique: true }
  );  

assessmentReportSchema.virtual('totalScore').get(function () {
    return this.continuousAssessment + this.examScore;
  });
  
assessmentReportSchema.pre('save', function (next) {
    const total = this.continuousAssessment + this.examScore;
  
    if (total >= 80) this.grade = 'A';
    else if (total >= 70) this.grade = 'B';
    else if (total >= 60) this.grade = 'C';
    else if (total >= 50) this.grade = 'D';
    else this.grade = 'F';
  
    next();
  });
  

module.exports = mongoose.model('AssessmentReport', assessmentReportSchema);
