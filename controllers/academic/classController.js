const Class = require('../../models/academic/class');

const Timetable = require('../../models/academic/timeTable');

const SubjectAllocation = require('../../models/academic/subjectAllocation');


exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    // .populate('classTeacher')
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching classes", error: err });
  }
};

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: "Error creating class", error: err });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating class", error: err });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Class deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting class", error: err });
  }
};

exports.getClassWithTimetable = async (req, res) => {
  try {
    const classId = req.params.classId;

    const classDetails = await Class.findById(classId)
      .populate({
        path: 'classTeacher',
        select: 'name'
      });

    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const { subjects, ...classData } = classDetails.toObject();

    const subjectAllocations = await SubjectAllocation.find({ class: classId })
      .populate({
        path: 'subject',
        select: 'name code'
      })
      .populate({
        path: 'teacher',
        select: 'name'
      });

    const assignedSubjects = subjectAllocations.map(allocation => ({
      subject: allocation.subject,
      teacher: allocation.teacher
    }));

    const timetable = await Timetable.findOne({ class: classId })
      .populate({
        path: 'schedule.subject',
        select: 'name code'
      });

    const groupedSchedule = {};
    if (timetable) {
      timetable.schedule.forEach(entry => {
        const day = entry.day;
        if (!groupedSchedule[day]) groupedSchedule[day] = [];

        groupedSchedule[day].push({
          subject: entry.isBreak ? null : entry.subject,
          isBreak: entry.isBreak,
          startTime: entry.startTime,
          endTime: entry.endTime
        });
      });
    }

    res.status(200).json({
      class: classData,
      assignedSubjects,
      timetable: Object.keys(groupedSchedule).length > 0 ? groupedSchedule : "No timetable assigned"
    });

  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
