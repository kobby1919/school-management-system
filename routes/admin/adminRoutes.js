const express = require('express');
const router = express.Router();
const { registerAdmin } = require('../../controllers/admin/adminController');
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

router.post('/create', authenticateUser, adminOnly, registerAdmin);

module.exports = router;
