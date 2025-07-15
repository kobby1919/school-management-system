const ExamTimetable = require('../../models/academic/examSchedule');

// Create timetable
exports.createTimetable = async (req, res) => {
  try {
    const timetable = new ExamTimetable(req.body);
    await timetable.save();
    res.status(201).json({ message: 'Exam timetable created', timetable });
  } catch (err) {
    res.status(500).json({ message: 'Error creating timetable', error: err.message });
  }
};

// Get timetable by class
exports.getTimetableByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const timetables = await ExamTimetable.find({ class: classId })
      .populate('schedule.exams.subject', 'name code')
      .sort({ weekStartDate: -1 });
    res.status(200).json(timetables);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching timetable', error: err.message });
  }
};

// Update timetable
exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await ExamTimetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    res.status(200).json({ message: 'Updated successfully', timetable });
  } catch (err) {
    res.status(500).json({ message: 'Error updating timetable', error: err.message });
  }
};

// Delete timetable
exports.deleteTimetable = async (req, res) => {
  try {
    const deleted = await ExamTimetable.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Timetable not found' });
    res.status(200).json({ message: 'Timetable deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting timetable', error: err.message });
  }
};
