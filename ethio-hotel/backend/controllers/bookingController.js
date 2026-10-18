const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Staff = require('../models/Staff');

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .populate('assignedStaff', 'name role')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.allBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room')
      .populate('assignedStaff', 'name role')
      .populate('cashReceivedBy', 'name role')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single booking (for receipt page)
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room')
      .populate('assignedStaff', 'name role')
      .populate('cashReceivedBy', 'name role');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a CASH booking (admin or receptionist marks cash paid)
exports.createCashBooking = async (req, res) => {
  try {
    const { userId, roomId, checkIn, checkOut, guests, cashReceivedById, specialRequests } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' });

    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      user: userId,
      room: roomId,
      checkIn,
      checkOut,
      guests: guests || 1,
      totalPrice,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      status: 'confirmed',
      cashReceivedBy: cashReceivedById || null,
      specialRequests
    });

    // Re-fetch with populated data
    const populated = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room')
      .populate('cashReceivedBy', 'name role');

    res.status(201).json({ success: true, booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update payment status (admin marks cash paid on existing booking)
exports.markCashPaid = async (req, res) => {
  try {
    const { cashReceivedById } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    booking.paymentStatus = 'paid';
    booking.paymentMethod = 'cash';
    booking.status = 'confirmed';
    if (cashReceivedById) booking.cashReceivedBy = cashReceivedById;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room')
      .populate('cashReceivedBy', 'name role');

    res.json({ success: true, booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};