const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, ctrl.getAnalytics);

module.exports = router;