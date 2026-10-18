const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { initializePayment, verifyPayment } = require('../controllers/paymentController');

router.post('/initialize', protect, initializePayment);
router.get('/verify/:txRef', verifyPayment);

module.exports = router;