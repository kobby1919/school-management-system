const Teacher = require('../../models/Teacher');
const SubjectAllocation = require('../../models/academic/subjectAllocation');
const Timetable = require('../../models/academic/timeTable');

// GET all teachers (admin only)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');

    // Fetch and attach subjects/classes for each teacher
    const enrichedTeachers = await Promise.all(teachers.map(async (teacher) => {
      const allocations = await SubjectAllocation.find({ teacher: teacher._id })
        .populate('subject', 'name code')
        .populate('class', 'name level');

      const assignedSubjects = [...new Map(
        allocations.map(allocation => [allocation.subject._id.toString(), allocation.subject])
      ).values()];

      const assignedClasses = [...new Map(
        allocations.map(allocation => [allocation.class._id.toString(), allocation.class])
      ).values()];

      return {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        profileImage: teacher.profileImage,
        assignedSubjects,
        assignedClasses
      };
    }));

    res.status(200).json(enrichedTeachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
};


//GET Teacher info(teacher only)
exports.getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const allocations = await SubjectAllocation.find({ teacher: teacher._id })
      .populate('subject', 'name code')
      .populate('class', 'name level');

    // Extract unique assigned subjects and classes
    const assignedSubjects = [...new Map(
      allocations.map(a => [a.subject._id.toString(), a.subject])
    ).values()];

    const assignedClassesMap = new Map();

    for (const allocation of allocations) {
      const classId = allocation.class._id.toString();

      // If we haven't handled this class yet
      if (!assignedClassesMap.has(classId)) {
        // Fetch the class timetable
        const timetable = await Timetable.findOne({ class: classId })
          .populate('schedule.subject', 'name code');

        const groupedSchedule = {};

        if (timetable) {
          for (const entry of timetable.schedule) {
            if (entry.isBreak) continue;

            const subjectId = entry.subject?._id?.toString();
            const teacherSubjects = allocations
              .filter(a => a.class._id.toString() === classId)
              .map(a => a.subject._id.toString());

            // Show only the subjects this teacher teaches in this class
            if (!teacherSubjects.includes(subjectId)) continue;

            const day = entry.day;
            if (!groupedSchedule[day]) groupedSchedule[day] = [];

            groupedSchedule[day].push({
              subject: entry.subject.name,
              startTime: formatTime(entry.startTime),
              endTime: formatTime(entry.endTime)
            });
          }
        }

        assignedClassesMap.set(classId, {
          _id: allocation.class._id,
          name: allocation.class.name,
          level: allocation.class.level,
          timetable: groupedSchedule
        });
      }
    }

    res.status(200).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      profileImage: teacher.profileImage,
      assignedSubjects,
      assignedClasses: Array.from(assignedClassesMap.values())
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher profile', error });
  }
};

// Helper to format time
function formatTime(time) {
  const [hour, minute] = time.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
}


exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user._id)
      .select('-password')
      .populate('assignedClass', 'name level')
      .populate('assignedSubjects', 'name code');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Fetch students in the class they teach (if any)
    let students = [];
    if (teacher.assignedClass) {
      students = await Student.find({ assignedClass: teacher.assignedClass._id })
        .select('fullName admissionNumber gender');
    }

    // Timetable (from assignedClass)
    let timetable = {};
    if (teacher.assignedClass) {
      const Timetable = require('../../models/academic/timeTable');
      const timetableDoc = await Timetable.findOne({ class: teacher.assignedClass._id })
        .populate('schedule.subject', 'name');

      if (timetableDoc) {
        timetableDoc.schedule.forEach(entry => {
          if (!entry.isBreak && entry.subject) {
            const day = entry.day;
            if (!timetable[day]) timetable[day] = [];
            timetable[day].push({
              subject: entry.subject.name,
              startTime: entry.startTime,
              endTime: entry.endTime
            });
          }
        });
      }
    }

    // Recent assessment reports (last 5)
    const reports = await AssessmentReport.find({ teacher: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'fullName')
      .populate('class', 'name level');

    res.status(200).json({
      profile: {
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        assignedClass: teacher.assignedClass,
        assignedSubjects: teacher.assignedSubjects
      },
      students,
      timetable,
      recentReports: reports
    });
  } catch (error) {
    console.error('Error building teacher dashboard:', error);
    res.status(500).json({ message: 'Error loading dashboard', error });
  }
};


// GET single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const allocations = await SubjectAllocation.find({ teacher: teacher._id })
      .populate('subject', 'name code')
      .populate('class', 'name level');

    const assignedSubjects = [...new Map(
      allocations.map(allocation => [allocation.subject._id.toString(), allocation.subject])
    ).values()];

    const assignedClasses = [...new Map(
      allocations.map(allocation => [allocation.class._id.toString(), allocation.class])
    ).values()];

    res.status(200).json({
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        profileImage: teacher.profileImage
      },
      assignedSubjects,
      assignedClasses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher', error });
  }
};


// UPDATE a teacher (by admin or self)
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error updating teacher', error });
  }
};

// DELETE a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error });
  }
};

//Assign Classes And Subjects
exports.assignClassAndSubjects = async (req, res) => {
    const { assignedClass, assignedSubjects } = req.body;
  
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        {
          assignedClass,
          assignedSubjects
        },
        { new: true }
      ).populate('assignedClass').populate('assignedSubjects');
  
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
  
      res.status(200).json({ message: 'Assignments updated', teacher });
    } catch (error) {
      res.status(500).json({ message: 'Error updating assignments', error });
    }
  };
  
