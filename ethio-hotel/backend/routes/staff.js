const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/staffController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, ctrl.getAll);
router.get('/:id', protect, adminOnly, ctrl.getOne);
router.post('/', protect, adminOnly, ctrl.create);
router.put('/:id', protect, adminOnly, ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);
router.post('/assign/:bookingId', protect, adminOnly, ctrl.assignToBooking);

module.exports = router;