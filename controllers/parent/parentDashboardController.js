const ExamSchedule = require('../../models/academic/examSchedule');

exports.getParentDashboard = async (req, res) => {
  try {
    const parent = await Parent.findById(req.user.id).populate({
      path: 'children',
      populate: { path: 'assignedClass', select: 'name level' }
    });

    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const children = parent.children;

    const results = await Promise.all(
      children.map(async (child) => {
        const reports = await AssessmentReport.find({ student: child._id })
          .populate('teacher', 'name')
          .populate('class', 'name level');

        const exams = await ExamSchedule.find({ class: child.assignedClass._id })
          .populate('subject', 'name')
          .sort({ date: 1 });

        return {
          childId: child._id,
          fullName: child.fullName,
          assignedClass: child.assignedClass,
          assessmentReports: reports,
          upcomingExams: exams
        };
      })
    );

    const notices = await Notice.find({
      visibleTo: { $in: ['parents', 'both'] }
    }).sort({ date: -1 });

    res.status(200).json({
      parentName: parent.fullName,
      dashboard: results,
      notices
    });
  } catch (error) {
    console.error('Parent dashboard error:', error);
    res.status(500).json({ message: 'Error fetching parent dashboard', error });
  }
};
