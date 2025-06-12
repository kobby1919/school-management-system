const TeacherAttendance = require('../../models/teacher/teacherAttendance');
const Teacher = require('../../models/Teacher');

exports.getWeeklyAttendance = async (req, res) => {
  try {
    const teacherId = req.params.id;

    
    const today = new Date();
    const dayOfWeek = today.getDay(); 

    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); 

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); 

    
    const records = await TeacherAttendance.find({
      teacher: teacherId,
      date: {
        $gte: monday,
        $lte: friday
      }
    });

    
    const daysMap = {
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null
    };

    records.forEach(record => {
      const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (daysMap.hasOwnProperty(dayName)) {
        daysMap[dayName] = record.status;
      }
    });


    const teacher = await Teacher.findById(teacherId).select('name');

    res.status(200).json({
      teacher: teacher?.name || 'Unknown',
      week: `${monday.toDateString()} to ${friday.toDateString()}`,
      attendance: daysMap
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly attendance", error });
  }
};


exports.markAttendance = async (req, res) => {
  const { status } = req.body;

  try {
    const existingRecord = await TeacherAttendance.findOne({
      teacher: req.user._id,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Attendance already marked for today." });
    }

    const record = new TeacherAttendance({
      teacher: req.user._id,
      status
    });

    await record.save();

    res.status(201).json({ message: "Attendance recorded successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    const history = await TeacherAttendance.find({ teacher: req.params.id })
      .sort({ date: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance history", error });
  }
};
