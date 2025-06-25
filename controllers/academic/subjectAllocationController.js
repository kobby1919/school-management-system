const SubjectAllocation = require('../../models/academic/subjectAllocation');


exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await SubjectAllocation.find()
      .populate('subject', 'name code')
      .populate('teacher', 'name email')
      .populate('class', 'name level')
      .populate('syllabus', 'title term academicYear description');

    // Group by teacher and class
    const grouped = {};

    allocations.forEach(allocation => {
      const key = `${allocation.teacher._id}-${allocation.class._id}`;

      if (!grouped[key]) {
        grouped[key] = {
          teacher: allocation.teacher,
          class: allocation.class,
          subjects: []
        };
      }

      grouped[key].subjects.push({
        subject: allocation.subject,
        syllabus: allocation.syllabus
      });
    });

    res.status(200).json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subject allocations', error: err });
  }
};


// Create new subject allocation (ensures one teacher can have multiple subjects/classes)
exports.createAllocation = async (req, res) => {
  let allocation;

  try {
    allocation = new SubjectAllocation(req.body);
    await allocation.save();

    const populated = await SubjectAllocation.findById(allocation._id)
      .populate('subject', 'name code')
      .populate('teacher', 'name email')
      .populate('class', 'name level')
      .populate('syllabus', 'title term academicYear');

    res.status(201).json({ message: 'Allocation created', allocation: populated });

  } catch (err) {
    if (allocation && allocation._id) {
      await SubjectAllocation.findByIdAndDelete(allocation._id);
    }

    res.status(400).json({ message: "Error creating allocation", error: err });
  }
};



// Update a subject allocation
exports.updateAllocation = async (req, res) => {
  try {
    const updated = await SubjectAllocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('subject', 'name code')
      .populate('teacher', 'name email')
      .populate('class', 'name level')
      .populate('syllabus', 'title term academicYear');

    if (!updated) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    res.status(200).json({ message: 'Allocation updated', allocation: updated });
  } catch (err) {
    res.status(400).json({ message: "Error updating allocation", error: err });
  }
};

// Delete subject allocation
exports.deleteAllocation = async (req, res) => {
  try {
    const deleted = await SubjectAllocation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    res.status(200).json({ message: "Allocation deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting allocation", error: err });
  }
};
