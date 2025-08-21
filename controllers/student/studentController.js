const Student = require('../../models/student/student');
const Class = require('../../models/academic/class');


// 1. Create a new student
exports.createStudent = async (req, res) => {
    try {
      const existingClass = await Class.findById(req.body.assignedClass);
      if (!existingClass) {
       return res.status(400).json({ message: 'Assigned class does not exist' });
      }
      const { admissionNumber } = req.body;
      const exists = await Student.findOne({ admissionNumber });
      if (exists) {
        return res.status(409).json({ message: 'Student with this admission number already exists' });
      }
  
      const student = new Student(req.body);
      await student.save();
      res.status(201).json({ message: 'Student profile created', student });
    } catch (error) {
      res.status(400).json({ message: 'Error creating student', error });
    }
  };
  

// 2. Get all students with pagination
exports.getAllStudents = async (req, res) => {
  console.log('⚡ getAllStudents called'); 
  try {
    const page = parseInt(req.query.page) || 1;  // current page
    const limit = parseInt(req.query.limit) || 10; // records per page
    const skip = (page - 1) * limit;

    const total = await Student.countDocuments(); // total number of students

    const students = await Student.find()
      .populate({
        path: 'attendanceRecords',
        select: 'date status class teacher',
        populate: [
          { path: 'class', select: 'name level' },
          { path: 'teacher', select: 'name' }
        ]
      })
      .populate('assignedClass', 'name level')
      .sort({ fullName: 1 }) // sort alphabetically
      .skip(skip)
      .limit(limit);
 
    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
      students
    });
  } catch (error) {
    console.error('❌ Error in getAllStudents:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
};


// Get students grouped by class, with optional per-class pagination
exports.getAllStudentsGroupedByClass = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const students = await Student.find()
      .populate('assignedClass', 'name level')
      .sort({ fullName: 1 });

    const grouped = {};

    students.forEach(student => {
      const key = `${student.assignedClass.level} ${student.assignedClass.name}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(student);
    });

    const paginatedGrouped = {};
    for (const key in grouped) {
      const start = (page - 1) * limit;
      const end = start + limit;
      paginatedGrouped[key] = {
        total: grouped[key].length,
        students: grouped[key].slice(start, end)
      };
    }

    res.status(200).json({
      page,
      limit,
      grouped: paginatedGrouped
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching grouped students', error });
  }
};

  
// 3. Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('assignedClass', 'name level')
      .populate('attendanceRecords');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
};

// 4. Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student updated', student });
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error });
  }
};

// 5. Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};
