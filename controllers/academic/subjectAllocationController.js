const SubjectAllocation = require('../../models/academic/subjectAllocation');

exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await SubjectAllocation.find()
      .populate('subject')
      .populate('teacher')
      .populate('class')
      .populate('syllabus');
    res.status(200).json(allocations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching allocations", error: err });
  }
};

exports.createAllocation = async (req, res) => {
  try {
    const allocation = new SubjectAllocation(req.body);
    await allocation.save();
    res.status(201).json(allocation);
  } catch (err) {
    res.status(400).json({ message: "Error creating allocation", error: err });
  }
};

exports.updateAllocation = async (req, res) => {
  try {
    const updated = await SubjectAllocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating allocation", error: err });
  }
};

exports.deleteAllocation = async (req, res) => {
  try {
    await SubjectAllocation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Allocation deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting allocation", error: err });
  }
};
