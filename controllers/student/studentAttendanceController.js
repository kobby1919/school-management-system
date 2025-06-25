const StudentAttendance = require('../../models/student/studentAttendance');
const Student = require('../../models/student/student');

// 1. Mark Attendance for a Student
exports.markStudentAttendance = async (req, res) => {
  try {
    const { student, status } = req.body;
    const classId = req.params.classId; // pulled from URL

    // Prevent duplicate attendance for same student on same day
    const alreadyMarked = await StudentAttendance.findOne({
      student,
      class: classId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked for this student today." });
    }

    const record = new StudentAttendance({
      student,
      class: classId,
      teacher: req.user._id, // Automatically pulled from auth middleware
      status
    });

    await record.save();
    res.status(201).json({ message: "Student attendance marked successfully", record });

  } catch (error) {
    res.status(500).json({ message: "Error marking student attendance", error });
  }
};

// 2. Get Attendance by Class for a Specific Date
exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    const targetDate = new Date(date);
    const records = await StudentAttendance.find({
      class: classId,
      date: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    }).populate('student', 'name');

    res.status(200).json(records);

  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

// 3. Get Student Attendance History
exports.getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await StudentAttendance.find({ student: studentId })
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student attendance", error });
  }
};
