const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');
const Booking = require('../models/Booking');

// 1. Get logged-in user's bookings
router.get('/my', protect, ctrl.myBookings);

// 2. Get ALL bookings (Admin Only) - THIS IS THE MISSING ROUTE
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name type')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Cancel a booking
router.put('/:id/cancel', protect, ctrl.cancelBooking);

// 4. Get a single booking (for receipt)
router.get('/:id', protect, ctrl.getBooking);

// 5. APPROVE A BOOKING (Mark as Paid)
router.put('/:id/mark-cash-paid', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. ADD FOOD/SERVICE TO A BOOKING
router.put('/:id/add-service', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const { serviceName, price, quantity } = req.body;
    
    if (!booking.extraServices) booking.extraServices = [];
    booking.extraServices.push({ serviceName, price, quantity: quantity || 1 });
    booking.totalPrice += (price * (quantity || 1));
    
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;