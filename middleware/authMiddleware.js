const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Class = require('../models/academic/class');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

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

/**
 * Middleware: Allow only the class teacher to proceed.
 * @param {'body'|'params'|'query'} classIdSource - Where to get classId from
 */
// const classTeacherOnly = (classIdSource = 'params') => {
//   return async (req, res, next) => {
//     try {
//       if (req.user.role === 'admin') {
//         return next();
//       }
//       const classId = req[classIdSource].classId || req[classIdSource].assignedClass || req[classIdSource].class;
//       if (!classId) {
//         return res.status(400).json({ message: 'Class ID is required' });
//       }

//       const targetClass = await Class.findById(classId);
//       if (!targetClass) {
//         return res.status(404).json({ message: 'Class not found' });
//       }

//       const isClassTeacher = targetClass.classTeacher?.toString() === req.user._id.toString();

//       if (!isClassTeacher) {
//         return res.status(403).json({ message: 'Access denied. Only class teachers can perform this action.' });
//       }

//       next();
//     } catch (error) {
//       console.error('Class teacher check error:', error);
//       res.status(500).json({ message: 'Server error validating class teacher access' });
//     }
//   };
// };


const classTeacherOnly = (classIdSource = 'params') => {
  return async (req, res, next) => {
    try {
      console.log('🔐 classTeacherOnly middleware running...');

      if (!req[classIdSource]) {
        console.log(`❌ req.${classIdSource} is undefined`);
        return res.status(400).json({ message: `Missing ${classIdSource} source` });
      }

      if (req.user.role === 'admin') {
        return next();
      }

      const classId =
        req[classIdSource].classId ||
        req[classIdSource].assignedClass ||
        req[classIdSource].class;

      console.log('🧠 Extracted classId:', classId);

      if (!classId) {
        return res.status(400).json({ message: 'Class ID is required' });
      }

      const targetClass = await Class.findById(classId);
      if (!targetClass) {
        return res.status(404).json({ message: 'Class not found' });
      }

      const isClassTeacher =
        targetClass.classTeacher?.toString() === req.user._id.toString();

      console.log('✅ isClassTeacher:', isClassTeacher);

      if (!isClassTeacher) {
        return res.status(403).json({
          message: 'Access denied. Only class teachers can perform this action.',
        });
      }

      next();
    } catch (err) {
      console.error('❌ Middleware crash:', err);
      res.status(500).json({ message: 'Server error in classTeacherOnly', error: err.message });
    }
  };
};


const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

const teacherOnly = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
  next();
};  

const adminOrTeacher = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Admins or Teachers only.' });
  }
  next();
};

module.exports = {
  authenticateUser,
  adminOnly,
  teacherOnly,
  adminOrTeacher,
  classTeacherOnly
};