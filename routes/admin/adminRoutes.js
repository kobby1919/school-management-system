const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController'); 
const { authenticateUser, adminOnly } = require('../../middleware/authMiddleware');

router.post('/create', authenticateUser, adminOnly, adminController.registerAdmin);
router.get('/dashboard', authenticateUser, adminOnly, adminController.getAdminDashboard);

module.exports = router;
