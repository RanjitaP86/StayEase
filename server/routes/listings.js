const express = require('express');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings (with optional filtering by location and price)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // --- FILTERING LOGIC ---
        const filters = {};

        // Location filter (case-insensitive search for city)
        if (req.query.location) {
            filters['location.city'] = { $regex: req.query.location, $options: 'i' };
        }

        // Price filter (finds listings with price less than or equal to maxPrice)
        if (req.query.maxPrice) {
            const maxPrice = parseInt(req.query.maxPrice);
            // Ensure price is a valid number greater than 0
            if (!isNaN(maxPrice) && maxPrice > 0) {
                filters.pricePerNight = { $lte: maxPrice };
            }
        }
        
        // Find listings that match the constructed filters object.
        // If filters is empty, it will find all listings.
        const listings = await Listing.find(filters).populate('host', 'name email');
        
        res.json(listings);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' }); // Use .json for consistent error responses
    }
});

// @route   GET /api/listings/:id
// @desc    Get a single listing by its ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('host', 'name email');
        
        if (!listing) {
            return res.status(404).json({ msg: 'Listing not found' });
        }
        
        res.json(listing);

    } catch (err) {
        console.error(err.message);
        // If the ID is in an invalid format, Mongoose will throw an error
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Listing not found' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private (Admins only)
router.post('/', [auth, admin], async (req, res) => {
    const { 
        title, 
        description, 
        imageUrl, 
        pricePerNight, 
        location, 
        maxGuests 
    } = req.body;

    // Basic validation
    if (!title || !description || !imageUrl || !pricePerNight || !location) {
        return res.status(400).json({ msg: 'Please include all required fields' });
    }

    try {
        const newListing = new Listing({
            title,
            description,
            imageUrl,
            pricePerNight,
            location,
            maxGuests,
            host: req.user.id // The user ID is attached by the 'auth' middleware
        });

        const listing = await newListing.save();
        
        res.status(201).json(listing); // 201 Created status is more appropriate

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;