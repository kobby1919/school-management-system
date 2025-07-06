const Notice = require('../../models/portal/notice');

// Create a notice
exports.createNotice = async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json({ message: 'Notice posted successfully', notice });
  } catch (err) {
    res.status(500).json({ message: 'Error posting notice', error: err.message });
  }
};

// Get all notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notices', error: err.message });
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notice not found' });
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notice', error: err.message });
  }
};
