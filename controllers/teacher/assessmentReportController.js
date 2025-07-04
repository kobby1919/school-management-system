const AssessmentReport = require('../../models/teacher/AssessmentReport');

// 1. Create a new report
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

    const report = new AssessmentReport({
      student,
      class: classId,
      term,
      continuousAssessment,
      examScore,
      performanceReport,
      teacher: req.user._id  // from auth middleware
    });

    await report.save();
    res.status(201).json({ message: 'Assessment report created', report });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assessment report', error });
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
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json({ message: 'Assessment report updated', report });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assessment report', error });
  }
};

// 3. Get all reports for a class
exports.getReportsByClass = async (req, res) => {
  try {
    const reports = await AssessmentReport.find({ class: req.params.classId })
      .populate('student', 'fullName') // student details (once ready)
      .populate('teacher', 'name');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

// 4. Get all reports for a student (for parent dashboard later)
exports.getReportsByStudent = async (req, res) => {
  try {
    const reports = await AssessmentReport.find({ student: req.params.studentId })
      .populate('class', 'name level')
      .populate('teacher', 'fullName');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student reports', error });
  }
};
