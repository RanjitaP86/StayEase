// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// CORS middleware
app.use(cors());

// --- API Routes ---
// Simple route for testing
app.get('/', (req, res) => {
  res.send('StayFinder API is running...');
});

// Import and use route files
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));