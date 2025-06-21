const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    location: {
        city: String,
        country: String,
        // ADD THESE TWO FIELDS
        lat: { type: Number, required: true }, // Latitude
        lng: { type: Number, required: true }  // Longitude
    },
    maxGuests: { type: Number, default: 1 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);