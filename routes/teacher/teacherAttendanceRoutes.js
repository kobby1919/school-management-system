const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/teacher/teacherAttendanceController');
const { authenticateUser, teacherOnly, adminOnly } = require('../../middleware/authMiddleware');


router.post('/mark', authenticateUser, teacherOnly,  attendanceController.markAttendance);

router.get('/:id/history', authenticateUser, adminOnly, attendanceController.getAttendanceHistory);

router.get('/:id/week', authenticateUser, adminOnly, attendanceController.getWeeklyAttendance);


module.exports = router;
