const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher'); 



exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newTeacher.save();

    res.status(201).json({ message: 'Account created successfully', user: newTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
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
