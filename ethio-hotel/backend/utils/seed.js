require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');

const rooms = [
  {
    name: 'Standard Single',
    type: 'Single',
    comfortLevel: 'Basic',
    description: 'A cozy, well-lit single room designed for solo travelers and business guests. Features a comfortable twin bed, a work-friendly desk, and a private bathroom with continuous hot water.',
    highlights: ['City view', 'Twin bed', 'Work desk', 'Free WiFi'],
    pricePerNight: 1500,
    capacity: 1,
    amenities: ['WiFi', 'AC', 'TV', 'Hot water'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    totalRooms: 10
  },
  {
    name: 'Double Deluxe',
    type: 'Double',
    comfortLevel: 'Comfort',
    description: 'A spacious double room with modern Ethiopian-inspired decor and warm lighting. Includes a queen bed, work desk, minibar, and a large window overlooking our garden courtyard.',
    highlights: ['Garden view', 'Queen bed', 'Minibar', 'Free breakfast'],
    pricePerNight: 2800,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    totalRooms: 8
  },
  {
    name: 'Executive Suite',
    type: 'Suite',
    comfortLevel: 'Premium',
    description: 'Luxury suite featuring a separate living room, a king-size bed with premium linens, and a private balcony with panoramic views of Addis Ababa.',
    highlights: ['Panoramic balcony', 'King bed', 'Jacuzzi', 'Free breakfast'],
    pricePerNight: 5500,
    capacity: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Jacuzzi', 'Balcony', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
    totalRooms: 4
  },
  {
    name: 'Presidential Suite',
    type: 'Presidential',
    comfortLevel: 'Luxury',
    description: 'Our finest suite — over 120 m² of pure elegance with 270° panoramic views of Addis Ababa. Features a private pool, dedicated butler, and personal chef on request.',
    highlights: ['270° Addis view', 'Private pool', 'Butler service', 'Personal chef'],
    pricePerNight: 12000,
    capacity: 4,
    amenities: ['WiFi', 'AC', 'Private Pool', 'Butler', 'Chef'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    totalRooms: 1
  }
];

(async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI ? process.env.MONGO_URI.split('@')[1] : 'No URI');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Atlas');

    await Room.deleteMany();
    await Room.insertMany(rooms);
    console.log('✅ Seeded', rooms.length, 'rooms');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();