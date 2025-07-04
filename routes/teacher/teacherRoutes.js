const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacher/teacherController');
const { authenticateUser, adminOnly, teacherOnly } = require('../../middleware/authMiddleware');

// Protected routes for teacher management
router.get('/', authenticateUser, adminOnly, teacherController.getAllTeachers);
router.get('/me', authenticateUser, teacherOnly, teacherController.getMyProfile);
router.get('/:id', authenticateUser, adminOnly, teacherController.getTeacherById);
router.put('/:id', authenticateUser, adminOnly, teacherController.updateTeacher);
router.delete('/:id', authenticateUser, adminOnly, teacherController.deleteTeacher);
router.put('/:id/assign', authenticateUser, adminOnly, teacherController.assignClassAndSubjects);

module.exports = router;
