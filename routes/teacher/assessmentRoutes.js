const express = require('express');
const router = express.Router();
const assessmentController = require('../../controllers/teacher/assessmentReportController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');


router.post('/', authenticateUser, adminOnly, assessmentController.createReport);

router.put('/:id', authenticateUser, adminOnly, assessmentController.updateReport);

router.get('/class/:classId', authenticateUser, adminOnly, assessmentController.getReportsByClass);

router.get('/student/:studentId', authenticateUser, adminOnly, assessmentController.getReportsByStudent);

module.exports = router;
