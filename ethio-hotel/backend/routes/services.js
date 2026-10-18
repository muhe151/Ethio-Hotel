const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.post('/', protect, adminOnly, ctrl.create);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;