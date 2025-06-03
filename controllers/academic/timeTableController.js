const Timetable = require('../../models/academic/timeTable');


exports.createTimetable = async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.status(201).json(timetable);
  } catch (err) {
    res.status(400).json({ message: "Error creating timetable", error: err });
  }
}; 


exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate('class', 'name level')
      .populate('schedule.subject');

    const formatted = timetables.map(timetable => {
      // Step 1: Group schedule by day
      const groupedSchedule = {};

      timetable.schedule.forEach(entry => {
        // Skip invalid entries
        if (!entry.isBreak && !entry.subject) return;

        const day = entry.day;
        if (!groupedSchedule[day]) {
          groupedSchedule[day] = [];
        }

        groupedSchedule[day].push({
          subject: entry.isBreak ? null : entry.subject,
          isBreak: entry.isBreak,
          startTime: entry.startTime,
          endTime: entry.endTime
        });
      });

      // Step 2: Format each timetable object
      return {
        _id: timetable._id,
        class: timetable.class,     // name & level
        term: timetable.term,
        timetable: groupedSchedule
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching timetables:", error);
    res.status(500).json({ message: "Error fetching timetables", error });
  }
};


exports.updateTimetable = async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating timetable", error: err });
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Timetable deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting timetable", error: err });
  }
};

