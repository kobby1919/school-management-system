const express = require('express');
const router = express.Router();
const feeController = require('../../controllers/finance/feeController');
const { authenticateUser, adminOnly, parentOnly } = require('../../middleware/authMiddleware');

// Create/update fee record (admin only)
router.post('/record', authenticateUser, adminOnly, feeController.createOrUpdateFeeRecord);

// Record payment (admin only)
router.post('/payment', authenticateUser, adminOnly, feeController.recordPayment);

// Get student fee status (admin or parent)
router.get('/student/:studentId', authenticateUser, feeController.getFeeStatusByStudent);

router.post(
    '/record/class',
    authenticateUser,
    adminOnly,
    feeController.createFeesForClass
  );

router.get(
    '/reports/summary',
    authenticateUser,
    adminOnly,
    feeController.getFinanceSummary
  );
  
  

module.exports = router;
