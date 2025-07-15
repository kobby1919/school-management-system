const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Parent = require('../../models/parent/parent');
const Student = require('../../models/student/student');
const ExamTimetable = require('../../models/academic/examSchedule');


exports.registerParent = async (req, res) => {
  try {
    const { fullName, email, password, children } = req.body;

    const existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = new Parent({
      fullName,
      email,
      password: hashedPassword,
      children
    });

    await parent.save();
    res.status(201).json({ message: 'Parent registered successfully', parent });
  } catch (error) {
    res.status(500).json({ message: 'Error registering parent', error });
  }
};

exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: parent._id, role: 'parent' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Login successful', token, parentId: parent._id });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};


exports.getMyChildren = async (req, res) => {
  try {
    const parent = await Parent.findById(req.user.id).populate({
      path: 'children',
      populate: { path: 'assignedClass', select: 'name level' }
    });

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Build response: for each child, also fetch exam schedules
    const childrenWithExams = await Promise.all(
      parent.children.map(async (child) => {
        let examSchedules = [];

        if (child.assignedClass?._id) {
          examSchedules = await ExamTimetable.find({ class: child.assignedClass._id })
            .populate('schedule.exams.subject', 'name code')
            .sort({ weekStartDate: 1 });
        }

        return {
          _id: child._id,
          fullName: child.fullName,
          assignedClass: child.assignedClass,
          examSchedules
        };
      })
    );

    res.status(200).json({
      fullName: parent.fullName,
      email: parent.email,
      children: childrenWithExams
    });
  } catch (error) {
    console.error('Error fetching children with exam schedules:', error);
    res.status(500).json({ message: 'Error fetching children', error: error.message });
  }
};



exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().select('-password');
    res.status(200).json(parents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching parents', error: err.message });
  }
};

exports.updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    res.status(200).json(parent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating parent', error: err.message });
  }
};

exports.deleteParent = async (req, res) => {
  try {
    const deleted = await Parent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Parent not found' });
    res.status(200).json({ message: 'Parent deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting parent', error: err.message });
  }
};
