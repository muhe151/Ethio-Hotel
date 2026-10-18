require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
require('./config/passport')(passport);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// 1. API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/services', require('./routes/services'));
app.use('/api/analytics', require('./routes/analytics'));


// Health check
app.get('/api/health', (req, res) => res.json({ message: 'Ethio Hotel API running' }));

// 2. Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Serve Frontend Static Files (THIS WAS THE MISSING PIECE)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 4. Fallback for unknown URLs (e.g., if user types a random path)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  // Instead of always sending index.html, try to send what they asked for.
  // If it's a broken link, send them to index.html
  res.status(404).sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server on http://localhost:' + PORT));

connectDB();