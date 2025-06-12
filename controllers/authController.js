const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher'); 



exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      role: 'teacher' 
    });

    await newTeacher.save();

    const token = jwt.sign({ id: newTeacher._id, role: newTeacher.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'Teacher account created',
      token,
      user: {
        id: newTeacher._id,
        name: newTeacher.name,
        role: newTeacher.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error registering teacher', error });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: teacher._id, role: teacher.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        role: teacher.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};


// const hashed = await bcrypt.hash('admin1234', 10);
// console.log(hashed);



// {
//   "class": "68460c8d47a7fe8667c7ddc8",
//   "term": "Term 1",
//   "schedule": [
//     {
//       "day": "Monday",
//       "subject": "6845c5dced685599b1c4531c",
//       "startTime": "08:00",
//       "endTime": "09:00"
//     },
//     {
//       "day": "Monday",
//       "isBreak": true,
//       "startTime": "09:00",
//       "endTime": "09:15"
//     },
//     {
//       "day": "Monday",
//       "subject": "6845c5feed685599b1c4531f",
//       "startTime": "09:15",
//       "endTime": "10:00"
//     },
//     {
//       "day": "Tuesday",
//       "subject": "6845c5c9ed685599b1c45319",
//       "startTime": "08:00",
//       "endTime": "09:00"
//     }
//   ]
// }