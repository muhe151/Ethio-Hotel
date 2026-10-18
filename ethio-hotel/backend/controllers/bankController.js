const Booking = require('../models/Booking');
const Room = require('../models/Room');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
exports.upload = multer({ storage });

exports.createBankBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentMethod, transactionId, selectedFood } = req.body;
    
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' });
    
    let totalPrice = nights * room.pricePerNight;
    let extraServices = [];

    // Parse the food items sent from the frontend
    if (selectedFood) {
      const parsedFood = JSON.parse(selectedFood);
      parsedFood.forEach(item => {
        extraServices.push({ serviceName: item.name, price: item.price, quantity: 1 });
        totalPrice += item.price;
      });
    }

    let receiptUrl = null;
    if (req.file) receiptUrl = '/uploads/' + req.file.filename;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn, checkOut, guests,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending', 
      status: 'pending',
      transactionId: transactionId || 'CASH-PAYMENT',
      receiptUrl,
      extraServices
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};