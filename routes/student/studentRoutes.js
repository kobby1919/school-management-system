const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/student/studentController');
const { authenticateUser, adminOnly, adminOrTeacher, classTeacherOnly } = require('../../middleware/authMiddleware');

// Get students grouped by class (Only class teachers and admins)
router.get(
  '/grouped/:classId',
  authenticateUser,
  adminOrTeacher,
  classTeacherOnly('params'), // verifies the user is class teacher of :classId
  studentController.getAllStudentsGroupedByClass
);

// Only admin can create/update/delete students
router.post('/', authenticateUser, adminOnly, studentController.createStudent);
router.put('/:id', authenticateUser, adminOnly, studentController.updateStudent);
router.delete('/:id', authenticateUser, adminOnly, studentController.deleteStudent);

// Admin and class teacher can view students of a class
router.get(
  '/',
  authenticateUser,
  adminOrTeacher, // only admin can fetch all (no class filter here)
  studentController.getAllStudents
);

// Get a single student (Admins only)
router.get('/:id', authenticateUser, adminOrTeacher, studentController.getStudentById);

module.exports = router;
