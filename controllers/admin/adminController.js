const bcrypt = require('bcryptjs');
const Teacher = require('../../models/Teacher');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Teacher({
      name,
      email,
      password: hashedPassword,
      role: 'admin', 
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', user: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
