const Class = require('../../models/academic/class');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('classTeacher');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching classes", error: err });
  }
};

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: "Error creating class", error: err });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating class", error: err });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Class deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting class", error: err });
  }
};
