const AssessmentReport = require('../../models/teacher/AssessmentReport');
const Student = require('../../models/student/student');

// 1. Create a new assessment report
exports.createReport = async (req, res) => {
  try {
    const {
      student,
      class: classId,
      term,
      continuousAssessment,
      examScore,
      performanceReport
    } = req.body;

    // Create and save new report
    const report = new AssessmentReport({
      student,
      class: classId,
      term,
      continuousAssessment,
      examScore,
      performanceReport,
      teacher: req.user._id
    });
    await report.save();

    // Add to student's academic history
    await Student.findByIdAndUpdate(
      student,
      { 
        $push: { 
          academicHistory: {
            term,
            year: new Date().getFullYear().toString(),
            performance: performanceReport
          }
        }
      }
    );

    res.status(201).json({ message: 'Assessment report created', report });
  } catch (error) {
    console.error('Error creating assessment report:', error);
    res.status(500).json({ message: 'Error creating assessment report', error: error.message });
  }
};

// 2. Update report by ID
exports.updateReport = async (req, res) => {
  try {
    const report = await AssessmentReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Assessment report updated', report });
  } catch (error) {
    console.error('Error updating assessment report:', error);
    res.status(500).json({ message: 'Error updating assessment report', error: error.message });
  }
};

// 3. Get all reports for a class
exports.getReportsByClass = async (req, res) => {
  try {
    const reports = await AssessmentReport.find({ class: req.params.classId })
      .populate('student', 'fullName')
      .populate('teacher', 'name');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by class:', error);
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

// 4. Get all reports for a student
exports.getReportsByStudent = async (req, res) => {
  try {
    const reports = await AssessmentReport.find({ student: req.params.studentId })
      .populate('class', 'name level')
      .populate('teacher', 'name');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching student reports:', error);
    res.status(500).json({ message: 'Error fetching student reports', error: error.message });
  }
};

// 5. Delete assessment report (Admin or teacher who created it)
exports.deleteReport = async (req, res) => {
  try {
    const report = await AssessmentReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // If not admin, ensure the requester is the creator
    if (req.user.role !== 'admin' && report.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: not authorized to delete this report' });
    }

    await report.deleteOne();

    // Remove from student's academic history
    await Student.findByIdAndUpdate(
      report.student,
      { $pull: { academicHistory: { term: report.term, year: new Date().getFullYear().toString(), performance: report.performanceReport } } }
    );

    res.status(200).json({ message: 'Assessment report deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment report:', error);
    res.status(500).json({ message: 'Error deleting assessment report', error: error.message });
  }
};
