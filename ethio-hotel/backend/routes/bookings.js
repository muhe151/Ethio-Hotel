const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const bankCtrl = require('../controllers/bankController'); 
const { protect, adminOnly } = require('../middleware/auth');
const Booking = require('../models/Booking');

// ==========================================
// 1. ROUTES FOR ADMINS (Must be placed BEFORE /:id)
// ==========================================

// Get ALL bookings
router.get('/all', protect, adminOnly, ctrl.allBookings);

// Approve a booking (Mark as Paid)
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

// Add Food/Service to a booking
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

// ==========================================
// 2. ROUTES FOR GUESTS & SPECIFIC PATHS
// ==========================================

// Get my bookings
router.get('/my', protect, ctrl.myBookings);

// PAY VIA BANK OR CASH (Direct Upload)
router.post('/bank-pay', protect, bankCtrl.upload.single('receipt'), bankCtrl.createBankBooking);

// Cancel a booking
router.put('/:id/cancel', protect, ctrl.cancelBooking);

// Get a single booking (MUST BE LAST)
router.get('/:id', protect, ctrl.getBooking);

module.exports = router;