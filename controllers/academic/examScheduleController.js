const ExamSchedule = require('../../models/academic/examSchedule');

exports.createExamSchedule = async (req, res) => {
  try {
    const schedule = new ExamSchedule(req.body);
    await schedule.save();
    res.status(201).json({ message: 'Exam schedule created', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam schedule', error });
  }
};

exports.getExamSchedulesByClass = async (req, res) => {
  try {
    const classId = req.params.classId;

    const schedules = await ExamSchedule.find({ class: classId })
      .populate('subject', 'name code')
      .sort({ date: 1 });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam schedules', error });
  }
};

exports.deleteExamSchedule = async (req, res) => {
  try {
    const deleted = await ExamSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Schedule not found' });
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam schedule', error });
  }
};
