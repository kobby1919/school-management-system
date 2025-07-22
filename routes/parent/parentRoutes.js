const express = require('express');
const router = express.Router();
const parentAuth = require('../../controllers/parent/parentAuthController');
const Notification = require('../../models/parent/notification');
const { authenticateUser, adminOnly, authenticateParent } = require('../../middleware/authMiddleware');

// Auth
router.post('/register', parentAuth.registerParent);
router.post('/login', parentAuth.loginParent);

// Protected
router.get('/me', authenticateParent, parentAuth.getMyChildren);

router.get('/', authenticateUser, adminOnly, parentAuth.getAllParents);
router.put('/:id', authenticateUser, adminOnly, parentAuth.updateParent);
router.delete('/:id', authenticateUser, adminOnly, parentAuth.deleteParent);

// Notifications
router.get('/notifications', authenticateParent, async (req, res) => {
    try {
      const notifications = await Notification.find({ parent: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching notifications', error: err.message });
    }
  });


module.exports = router;
