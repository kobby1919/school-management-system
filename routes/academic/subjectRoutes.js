const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/academic/subjectController');

router.get('/', subjectController.getAllSubjects);
router.get('/group/:group', subjectController.getSubjectsByGroup);
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);
module.exports = router;
