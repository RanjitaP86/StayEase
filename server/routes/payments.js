const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/payments/create-checkout-session
// @desc    Create a Stripe checkout session for a booking
// @access  Private
router.post('/create-checkout-session', auth, async (req, res) => {
    // The frontend will send the booking details
    const { listing, checkInDate, checkOutDate, totalPrice } = req.body;

    // These URLs are where Stripe will redirect the user after the session
    const success_url = `${req.protocol}://${req.get('host')}/booking/success?listingId=${listing._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&totalPrice=${totalPrice}`;
    const cancel_url = `${req.protocol}://${req.get('host')}/listing/${listing._id}`;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: listing.title,
                        images: [listing.imageUrl],
                    },
                    unit_amount: Math.round(totalPrice * 100), // Price in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: success_url,
            cancel_url: cancel_url,
        });

        res.json({ id: session.id }); // Send the session ID back to the frontend

    } catch (err) {
        console.error('Stripe session error:', err.message);
        res.status(500).json({ msg: 'Server error with Stripe' });
    }
});

module.exports = router;