const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/student/studentAttendanceController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

// POST: Mark student attendance
router.post('/mark', authenticateUser, adminOnly, attendanceController.markStudentAttendance);

// GET: Attendance for class on a given date
router.get('/class', authenticateUser, adminOnly, attendanceController.getAttendanceByClassAndDate);

// GET: Student attendance history
router.get('/:studentId/history', authenticateUser, adminOnly, attendanceController.getStudentHistory);

module.exports = router;
