const express = require('express');
const router = express.Router();
const assessmentController = require('../../controllers/teacher/assessmentReportController');
const { authenticateUser, adminOnly, classTeacherOnly, adminOrTeacher } = require('../../middleware/authMiddleware');


router.post('/', authenticateUser, classTeacherOnly('body'), assessmentController.createReport);

router.put('/:id', authenticateUser, adminOnly, assessmentController.updateReport);

router.get('/class/:classId', authenticateUser, adminOnly, assessmentController.getReportsByClass);

router.get('/student/:studentId', authenticateUser, classTeacherOnly('body'), assessmentController.getReportsByStudent);

module.exports = router;
