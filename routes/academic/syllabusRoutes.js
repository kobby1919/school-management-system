const express = require('express');
const router = express.Router();
const syllabusController = require('../../controllers/academic/syllabusController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

router.post('/', authenticateUser, adminOnly, syllabusController.createSyllabus);
router.get('/', authenticateUser, adminOnly, syllabusController.getAllSyllabus);
router.get('/subject/:subjectId', authenticateUser, adminOnly, syllabusController.getSyllabusBySubject);
router.put('/:id', authenticateUser, adminOnly, syllabusController.updateSyllabus);
router.delete('/:id', authenticateUser, adminOnly, syllabusController.deleteSyllabus);

module.exports = router;
