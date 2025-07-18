const StudentAttendance = require('../../models/student/studentAttendance');
const Student = require('../../models/student/student');

// 1. Mark Attendance for a Student
exports.markStudentAttendance = async (req, res) => {
  try {
    const { student, status, remark } = req.body;
    const classId = req.params.classId;

   // Prevent duplicate attendance for same student on same day
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const alreadyMarked = await StudentAttendance.findOne({
      student,
      class: classId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });


    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked for this student today." });
    }

    // Create new attendance record, now including remark
    const record = new StudentAttendance({
      student,
      class: classId,
      teacher: req.user._id,
      status,
      remark 
    });

    await record.save();

    await Student.findByIdAndUpdate(
      student,
      { $push: { attendanceRecords: record._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Student attendance marked successfully",
      record
    });

  } catch (error) {
    res.status(500).json({ message: "Error marking student attendance", error });
  }
};



// 2. Get Attendance by Class for a Specific Date
exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const classId = req.params.classId;
    const { date } = req.query;

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const records = await StudentAttendance.find({
      class: classId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
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


exports.getStudentAttendanceStatistics = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const records = await StudentAttendance.find({ student: studentId });

    const totalMarked = records.length;
    let present = 0, absent = 0, late = 0;

    records.forEach(r => {
      if (r.status === 'Present') present ++;
      else if (r.status === 'Absent') absent ++;
      else if (r.status === 'Late') late ++;
    });

    const attendancePercentage = totalMarked > 0 ? ((present + late) / totalMarked) * 100 : 0;
    
    res.status(200).json({
      studentId,
      totalMarked,
      present,
      absent,
      late,
      attendancePercentage: attendancePercentage.toFixed(2)
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance statistics", error });
  }
};

exports.getClassAttendanceStatistics = async (req, res) => {
  try {
    const classId = req.params.classId;

    const records = await StudentAttendance.find({ class: classId });

    const totalMarked = records.length;
    let present = 0, absent = 0, late = 0;

    records.forEach(r => {
      if (r.status === 'Present') present ++;
      else if (r.status === 'Absent') absent ++;
      else if (r.status === 'Late') late ++;
    });

    const attendancePercentage = totalMarked > 0 ? ((present + late) / totalMarked) * 100 : 0;

    res.status(200).json({
      classId,
      totalMarked,
      present,
      absent,
      late,
      attendancePercentage: attendancePercentage.toFixed(2) 
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching class attendance statistics", error});
  }
};


// Get Student Attendance for Calendar View
exports.getStudentAttendanceCalendar = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await StudentAttendance.find({ student: studentId })
      .sort({ date: 1 });  // oldest first

    const calendar = records.map(r => ({
      date: r.date.toISOString().split('T')[0],
      status: r.status,
      remark: r.remark
    }));

    res.status(200).json({
      studentId,
      calendar
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching calendar attendance", error });
  }
};
