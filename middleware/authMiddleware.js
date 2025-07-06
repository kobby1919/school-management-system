const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Class = require('../models/academic/class');
const Parent = require('../models/parent/parent');

// 🔐 Shared Auth Middleware: For teachers/admins (with role)
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Teacher.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 🔐 New: Auth Middleware for Parents
const authenticateParent = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const parent = await Parent.findById(decoded.id).select('-password');
    if (!parent) return res.status(401).json({ message: 'Parent not found' });

    req.user = { id: parent._id, role: 'parent' }; // Custom role assignment
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid parent token' });
  }
};

// 🧱 Only Admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// 🧱 Only Teacher
const teacherOnly = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
  next();
};

// 🧱 Only Parent
const parentOnly = (req, res, next) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Access denied. Parents only.' });
  }
  next();
};

// 🧱 Admin or Teacher
const adminOrTeacher = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Admins or Teachers only.' });
  }
  next();
};

// 🧱 Only Class Teacher of Target Class
const classTeacherOnly = (classIdSource = 'params') => {
  return async (req, res, next) => {
    try {
      if (!req[classIdSource]) {
        return res.status(400).json({ message: `Missing ${classIdSource} source` });
      }

      if (req.user.role === 'admin') return next();

      const classId =
        req[classIdSource].classId ||
        req[classIdSource].assignedClass ||
        req[classIdSource].class;

      if (!classId) {
        return res.status(400).json({ message: 'Class ID is required' });
      }

      const targetClass = await Class.findById(classId);
      if (!targetClass) return res.status(404).json({ message: 'Class not found' });

      const isClassTeacher =
        targetClass.classTeacher?.toString() === req.user._id.toString();

      if (!isClassTeacher) {
        return res.status(403).json({
          message: 'Access denied. Only class teachers can perform this action.',
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error in classTeacherOnly', error: err.message });
    }
  };
};

module.exports = {
  authenticateUser,
  authenticateParent,
  adminOnly,
  teacherOnly,
  parentOnly,
  adminOrTeacher,
  classTeacherOnly
};
