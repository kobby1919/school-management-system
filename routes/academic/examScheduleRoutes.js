const express = require('express');
const router = express.Router();
const controller = require('../../controllers/academic/examScheduleController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

// Admin routes
router.post('/', authenticateUser, adminOnly, controller.createTimetable);
router.put('/:id', authenticateUser, adminOnly, controller.updateTimetable);
router.delete('/:id', authenticateUser, adminOnly, controller.deleteTimetable);

// Public
router.get('/class/:classId', controller.getTimetableByClass);

module.exports = router;
