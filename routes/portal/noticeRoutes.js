const express = require('express');
const router = express.Router();
const controller = require('../../controllers/portal/noticeController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

// Admin routes
router.post('/', authenticateUser, adminOnly, controller.createNotice);
router.get('/', controller.getNotices); // Public access for portal display
router.delete('/:id', authenticateUser, adminOnly, controller.deleteNotice);

module.exports = router;
