const express = require('express');
const router = express.Router();
const subjectAllocationController = require('../../controllers/academic/subjectAllocationController');


router.get('/', subjectAllocationController.getAllAllocations);
router.post('/', subjectAllocationController.createAllocation);
router.put('/:id', subjectAllocationController.updateAllocation);
router.delete('/:id', subjectAllocationController.deleteAllocation);

module.exports = router;
