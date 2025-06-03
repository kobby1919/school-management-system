const Syllabus = require('../../models/academic/syllabus');

// Create syllabus
exports.createSyllabus = async (req, res) => {
  try {
    const syllabus = new Syllabus(req.body);
    await syllabus.save();
    res.status(201).json(syllabus);
  } catch (err) {
    res.status(400).json({ message: "Error creating syllabus", error: err });
  }
};

// Get all syllabus
exports.getAllSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.find();
    res.status(200).json(syllabus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching syllabi", error: err });
  }
};

// Update syllabus
exports.updateSyllabus = async (req, res) => {
  try {
    const updated = await Syllabus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating syllabus", error: err });
  }
};

// Delete syllabus
exports.deleteSyllabus = async (req, res) => {
  try {
    await Syllabus.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Syllabus deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting syllabus", error: err });
  }
};
