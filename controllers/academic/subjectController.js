const Subject = require('../../models/academic/subject');

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

exports.getSubjectsByGroup = async (req, res) => {
  try {
    const group = req.params.group;
    const subjects = await Subject.find({ group });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grouped subjects', error });
  }
};



exports.createSubject = async (req, res) => {
  try {
    const { name, level } = req.body;

    const existing = await Subject.findOne({ name, level });
    if (existing) {
      return res.status(400).json({ message: 'Subject with same name and level already exists.' });
    }

    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subject', error });
  }
};


exports.updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating subject", error: err });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Subject deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting subject", error: err });
  }
};
