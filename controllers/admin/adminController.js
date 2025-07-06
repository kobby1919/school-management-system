const bcrypt = require('bcryptjs');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/student/student');
const Class = require('../../models/academic/class');
const Subject = require('../../models/academic/subject');
const Notice = require('../../models/portal/notice');
const AssessmentReport = require('../../models/teacher/AssessmentReport');
const ExamSchedule = require('../../models/academic/examSchedule');
const FeeRecord = require('../../models/finance/feeRecord');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Teacher({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', user: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// ✅ Admin Dashboard with Finance Summary
exports.getAdminDashboard = async (req, res) => {
  try {
    const currentTerm = '2024/2025 - Term 2'; // Make dynamic if needed

    const [
      totalTeachers,
      totalStudents,
      totalClasses,
      totalSubjects,
      recentNotices,
      recentReports,
      upcomingExams,
      unassignedClasses,
      feeRecords
    ] = await Promise.all([
      Teacher.countDocuments(),
      Student.countDocuments(),
      Class.countDocuments(),
      Subject.countDocuments(),
      Notice.find().sort({ createdAt: -1 }).limit(5),
      AssessmentReport.find().sort({ createdAt: -1 }).limit(5)
        .populate('student', 'fullName')
        .populate('class', 'name level')
        .populate('teacher', 'name'),
      ExamSchedule.find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .limit(5)
        .populate('class', 'name level')
        .populate('subject', 'name'),
      Class.find({ classTeacher: null }).select('name level'),
      FeeRecord.find({ term: currentTerm })
    ]);

    let totalDue = 0;
    let totalPaid = 0;
    let totalBalance = 0;
    let paidCount = 0;
    let partialCount = 0;
    let unpaidCount = 0;

    feeRecords.forEach(record => {
      totalDue += record.totalDue;
      totalPaid += record.amountPaid;
      totalBalance += record.balance;

      if (record.status === 'Paid') paidCount++;
      else if (record.status === 'Partial') partialCount++;
      else unpaidCount++;
    });

    res.status(200).json({
      totals: {
        teachers: totalTeachers,
        students: totalStudents,
        classes: totalClasses,
        subjects: totalSubjects
      },
      recentNotices,
      recentReports,
      upcomingExams,
      unassignedClasses,
      financeSummary: {
        term: currentTerm,
        totalDue,
        totalPaid,
        totalBalance,
        paidCount,
        partialCount,
        unpaidCount
      }
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).json({ message: 'Error loading admin dashboard', error });
  }
};
