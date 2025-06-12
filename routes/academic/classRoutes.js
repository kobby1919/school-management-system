const express = require('express');
const router = express.Router();
const classController = require('../../controllers/academic/classController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

router.get('/', authenticateUser, adminOnly, classController.getAllClasses);
router.get('/:classId/details', authenticateUser, adminOnly, classController.getClassWithTimetable);
router.post('/', authenticateUser, adminOnly, classController.createClass);
router.put('/:id', authenticateUser, adminOnly, classController.updateClass);
router.delete('/:id', authenticateUser, adminOnly, classController.deleteClass);

module.exports = router;
