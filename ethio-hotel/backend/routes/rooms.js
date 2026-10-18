const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAllRooms);
router.get('/:id', ctrl.getRoom);
router.post('/', protect, adminOnly, ctrl.createRoom);
router.put('/:id', protect, adminOnly, ctrl.updateRoom);
router.delete('/:id', protect, adminOnly, ctrl.deleteRoom);

module.exports = router;