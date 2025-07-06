const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Parent = require('../../models/parent/parent');
const Student = require('../../models/student/student');

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

    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    res.status(200).json({
      fullName: parent.fullName,
      email: parent.email,
      children: parent.children
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children', error });
  }
};
