const express = require('express');
const router = express.Router();
const assessmentController = require('../../controllers/teacher/assessmentReportController');
const { authenticateUser, adminOnly, classTeacherOnly, adminOrTeacher } = require('../../middleware/authMiddleware');


router.post('/', authenticateUser, classTeacherOnly('body'), assessmentController.createReport);

router.put('/:id', authenticateUser, adminOnly, assessmentController.updateReport);

router.get('/class/:classId', authenticateUser, adminOrTeacher, assessmentController.getReportsByClass);

router.get('/student/:studentId', authenticateUser, adminOrTeacher, assessmentController.getReportsByStudent);

router.delete('/:id', authenticateUser, adminOrTeacher, assessmentController.deleteReport);


module.exports = router;
