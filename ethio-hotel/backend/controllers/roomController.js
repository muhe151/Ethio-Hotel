const Room = require('../models/Room');
const Booking = require('../models/Booking');

// GET ALL ROOMS
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE ROOM
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE ROOM (FIXED)
exports.createRoom = async (req, res) => {
  try {
    console.log("👉 Data received from frontend:", req.body);

    // Ensure req.body exists and has a name
    if (!req.body || !req.body.name) {
      return res.status(400).json({ message: 'Room name is missing in request body' });
    }

    const newRoom = new Room({
      name: req.body.name,
      type: req.body.type || 'Single',
      pricePerNight: Number(req.body.pricePerNight) || 1000,
      totalRooms: Number(req.body.totalRooms) || 1,
      capacity: 2,
      available: true,
    });

    await newRoom.save();
    console.log("✅ Room saved successfully:", newRoom._id);
    res.status(201).json(newRoom);
    
  } catch (err) {
    console.error("❌ Error saving room:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ROOM
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ROOM
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};