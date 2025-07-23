const StudentAttendance = require('../../models/student/studentAttendance');
const Student = require('../../models/student/student');
const Parent = require('../../models/parent/parent'); 
const Notification = require('../../models/parent/notification');
const AttendanceAudit = require('../../models/student/attendanceAudit');

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

    if (status === 'Absent' || status === 'Late') {
      const studentDoc = await Student.findById(student).populate('assignedClass');
      const parents = await Parent.find({ children: student });
    
      const message = `Your child ${studentDoc.fullName} in class ${studentDoc.assignedClass?.name || ''} was marked as ${status}${remark ? ` (${remark})` : ''}.`;
    
      for (const parent of parents) {
        await Notification.create({
          parent: parent._id,
          message
        });
        console.log(`📢 Notification sent to parent (${parent.fullName}): ${message}`);
      }
    }
    

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


// Edit past attendance with audit
exports.editAttendanceWithAudit = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { newStatus, newRemark } = req.body;

    // Find the original attendance record
    const record = await StudentAttendance.findById(attendanceId);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Save old values for audit
    const oldStatus = record.status;
    const oldRemark = record.remark;

    // Update the attendance record
    record.status = newStatus;
    record.remark = newRemark;
    await record.save();

    // Create audit log
    const audit = new AttendanceAudit({
      attendanceRecord: record._id,
      editedBy: req.user._id, // the teacher/admin who did it
      oldStatus,
      newStatus,
      oldRemark,
      newRemark
    });
    await audit.save();

    res.status(200).json({
      message: 'Attendance updated successfully and audit logged',
      updatedRecord: record,
      auditLog: audit
    });

  } catch (error) {
    console.error('Error editing attendance:', error);
    res.status(500).json({ message: 'Error editing attendance', error: error.message });
  }
};

exports.getAttendanceAuditLogs = async (req, res) => {
  try {
    const { studentId, editedBy } = req.query;

    const filter = {};

    // Filter by student (via attendanceRecord's student field)
    if (studentId) {
      // Find all attendance records of this student
      const studentRecords = await StudentAttendance.find({ student: studentId }).select('_id');
      const recordIds = studentRecords.map(r => r._id);
      filter.attendanceRecord = { $in: recordIds };
    }

    // Filter by who edited
    if (editedBy) {
      filter.editedBy = editedBy;
    }

    const logs = await AttendanceAudit.find(filter)
      .populate('attendanceRecord', 'student class date')   // show student, class & date
      .populate('editedBy', 'name role')                    // who edited
      .sort({ createdAt: -1 });                              // latest first

    res.status(200).json(logs);

  } catch (error) {
    console.error('Error fetching attendance audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};

