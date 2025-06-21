
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load models
const User = require('./models/User');
const Listing = require('./models/Listing');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// --- CORRECTED SAMPLE DATA ---
const listings = [
    { 
        title: 'Serene Beachfront Villa', 
        description: 'Wake up to the sound of waves.', 
        imageUrl: 'https://images.unsplash.com/photo-1613553422385-23def2396316?auto=format&fit=crop&w=1074&q=80', 
        pricePerNight: 550, 
        location: { city: 'Malibu', country: 'USA', lat: 34.0259, lng: -118.7798 }, 
        maxGuests: 6 
    },
    { 
        title: 'Cozy Downtown Loft', 
        description: 'In the heart of the city.', 
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80', 
        pricePerNight: 210, 
        location: { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 }, 
        maxGuests: 2 
    },
    { 
        title: 'Rustic Mountain Cabin', 
        description: 'Escape to nature.', 
        imageUrl: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=1470&q=80', 
        pricePerNight: 300, 
        location: { city: 'Aspen', country: 'USA', lat: 39.1911, lng: -106.8175 }, // <-- FIXED
        maxGuests: 4
    },
    { 
        title: 'Modern City Apartment', 
        description: 'Sleek and stylish.', 
        imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1471&q=80', 
        pricePerNight: 150, 
        location: { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 }, // <-- FIXED
        maxGuests: 3 
    },
    { 
        title: 'Chic Parisian Flat', 
        description: 'Experience the magic of Paris.', 
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1380&q=80', 
        pricePerNight: 180, 
        location: { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 }, 
        maxGuests: 2 
    },
];

const importData = async () => {
    try {
        const hostUser = await User.findOne();
        if (!hostUser) {
            console.error('No users found in the database. Please register a user first.');
            process.exit();
        }
        const listingsWithHost = listings.map(l => ({ ...l, host: hostUser._id }));
        await Listing.deleteMany();
        await Listing.insertMany(listingsWithHost);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Listing.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}