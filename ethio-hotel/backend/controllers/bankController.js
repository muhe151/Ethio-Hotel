const Booking = require('../models/Booking');
const Room = require('../models/Room');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup Multer for saving screenshots locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
exports.upload = multer({ storage });

exports.createBankBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentMethod, transactionId, selectedFood } = req.body;
    
    // 1. Verify room exists
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // 2. Calculate price
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' });
    
    let totalPrice = nights * room.pricePerNight;
    let extraServices = [];

    // 3. Parse Food/Services
    if (selectedFood) {
      const parsedFood = JSON.parse(selectedFood);
      parsedFood.forEach(item => {
        extraServices.push({ serviceName: item.name, price: item.price, quantity: 1 });
        totalPrice += item.price;
      });
    }

    // 4. Check for Screenshot
    let receiptUrl = null;
    if (req.file) {
      receiptUrl = '/uploads/' + req.file.filename;
    } else if (paymentMethod !== 'cash') {
      return res.status(400).json({ message: 'Payment screenshot is required for bank transfers' });
    }

    // 5. Create the Booking with the CORRECT payment method
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      guests: guests || 1,
      totalPrice,
      paymentMethod: paymentMethod, // Saves as 'telebirr', 'cbe', etc.
      paymentStatus: 'pending',
      status: 'pending',
      transactionId: transactionId || 'CASH',
      receiptUrl,
      extraServices
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("Bank Booking Error:", err);
    res.status(500).json({ message: err.message });
  }
};