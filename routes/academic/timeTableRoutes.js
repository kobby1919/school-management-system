const express = require('express');
const router = express.Router();
const timetableController = require('../../controllers/academic/timeTableController');

// Create a new timetable
router.post('/', timetableController.createTimetable);

// Get all timetables
router.get('/', timetableController.getAllTimetables);

// Update a timetable by ID
router.put('/:id', timetableController.updateTimetable);

// Delete a timetable by ID
router.delete('/:id', timetableController.deleteTimetable);

module.exports = router;
