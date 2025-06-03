const express = require('express');
const router = express.Router();
const syllabusController = require('../../controllers/academic/syllabusController');

// CRUD routes
router.post('/', syllabusController.createSyllabus);
router.get('/', syllabusController.getAllSyllabus);
router.put('/:id', syllabusController.updateSyllabus);
router.delete('/:id', syllabusController.deleteSyllabus);

module.exports = router;
