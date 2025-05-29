const express = require('express');
const router = express.Router();
const classController = require('../../controllers/academic/classController');

router.get('/', classController.getAllClasses);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router;
