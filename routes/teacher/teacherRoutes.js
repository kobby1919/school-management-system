const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacher/teacherController');
const authenticateUser = require('../../middleware/authMiddleware');

// Protected routes for teacher management
router.get('/', authenticateUser, teacherController.getAllTeachers);
router.get('/:id', authenticateUser, teacherController.getTeacherById);
router.put('/:id', authenticateUser, teacherController.updateTeacher);
router.delete('/:id', authenticateUser, teacherController.deleteTeacher);

module.exports = router;
