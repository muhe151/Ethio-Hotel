const Staff = require('../models/Staff');
const Booking = require('../models/Booking');

exports.getAll = async (req, res) => {
  try {
    const staff = await Staff.find().populate('assignedRoom', 'name type').sort('name');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('assignedRoom');
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign staff member to a booking
exports.assignToBooking = async (req, res) => {
  try {
    const { staffId } = req.body;
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (!booking.assignedStaff.includes(staffId)) {
      booking.assignedStaff.push(staffId);
      await booking.save();
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};