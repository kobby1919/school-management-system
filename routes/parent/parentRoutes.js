const express = require('express');
const router = express.Router();
const parentAuth = require('../../controllers/parent/parentAuthController');
const { authenticateParent } = require('../../middleware/authMiddleware');

// Auth
router.post('/register', parentAuth.registerParent);
router.post('/login', parentAuth.loginParent);

// Protected
router.get('/me', authenticateParent, parentAuth.getMyChildren);

module.exports = router;
