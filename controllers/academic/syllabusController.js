const Syllabus = require('../../models/academic/syllabus');

exports.createSyllabus = async (req, res) => {
  try {
    const syllabus = new Syllabus(req.body);
    await syllabus.save();
    res.status(201).json(syllabus);
  } catch (error) {
    res.status(400).json({ message: "Error creating syllabus", error });
  }
};

exports.getAllSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.find().populate('subject', 'name code');
    res.status(200).json(syllabus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching syllabus", error });
  }
};

exports.getSyllabusBySubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const syllabus = await Syllabus.find({ subject: subjectId }).populate('subject', 'name code');
    res.status(200).json(syllabus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching syllabi by subject", error });
  }
};


exports.updateSyllabus = async (req, res) => {
  try {
    const updated = await Syllabus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Syllabus not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating syllabus", error });
  }
};

exports.deleteSyllabus = async (req, res) => {
  try {
    const deleted = await Syllabus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Syllabus not found" });
    res.status(200).json({ message: "Syllabus deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting syllabus", error });
  }
};
