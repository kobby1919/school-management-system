const express = require('express');
const router = express.Router();
const parentAuth = require('../../controllers/parent/parentAuthController');
const { authenticateUser, adminOnly, authenticateParent } = require('../../middleware/authMiddleware');

// Auth
router.post('/register', parentAuth.registerParent);
router.post('/login', parentAuth.loginParent);

// Protected
router.get('/me', authenticateParent, parentAuth.getMyChildren);

router.get('/', authenticateUser, adminOnly, parentAuth.getAllParents);
router.put('/:id', authenticateUser, adminOnly, parentAuth.updateParent);
router.delete('/:id', authenticateUser, adminOnly, parentAuth.deleteParent);


module.exports = router;
