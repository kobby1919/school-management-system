const Teacher = require('../../models/Teacher');
const SubjectAllocation = require('../../models/academic/subjectAllocation');

// GET all teachers (admin only)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
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
  
