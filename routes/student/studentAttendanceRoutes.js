const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/student/studentAttendanceController');
const { authenticateUser, adminOnly, teacherOnly, classTeacherOnly } = require('../../middleware/authMiddleware');

// POST: Mark student attendance (Only class teacher of classId can do this)
router.post(
  '/mark/:classId',
  authenticateUser,
  teacherOnly,
  classTeacherOnly('params'),
  attendanceController.markStudentAttendance
);

// GET: Attendance for class on a given date (class teacher or admin)
router.get(
  '/class/:classId',
  authenticateUser,
  adminOnly, // you can also add classTeacherOnly here if needed
  attendanceController.getAttendanceByClassAndDate
);

// GET: Student attendance history (Admin only)
router.get('/:studentId/history', authenticateUser, adminOnly, attendanceController.getStudentHistory);

module.exports = router;
