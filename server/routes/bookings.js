// server/routes/bookings.js
const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth'); // Import auth middleware
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking (Protected Route)
router.post('/', auth, async (req, res) => {
    const { listing, checkInDate, checkOutDate, totalPrice } = req.body;
    try {
        const newBooking = new Booking({
            listing,
            user: req.user.id, // Get user from the middleware
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-bookings', auth, async (req, res) => {
    try {
        // Find all bookings where the 'user' field matches the logged-in user's ID.
        // req.user.id is provided by the 'auth' middleware.
        const bookings = await Booking.find({ user: req.user.id })
            .populate('listing', 'title imageUrl location') // <-- Populate listing details
            .sort({ checkInDate: -1 }); // Show the most recent bookings first

        res.json(bookings);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;