const express = require('express');
const router = express.Router();
const controller = require('../../controllers/academic/examScheduleController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

// Admin creates/deletes
router.post('/', authenticateUser, adminOnly, controller.createExamSchedule);
router.delete('/:id', authenticateUser, adminOnly, controller.deleteExamSchedule);

// Public (parent portal can fetch)
router.get('/class/:classId', controller.getExamSchedulesByClass);

module.exports = router;
