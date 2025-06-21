import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing } from '../services/api'; // We don't need createBooking here anymore
import Map from '../components/Map';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../services/api'; // Import the new function

const ListingDetailPage = () => {
    // --- State Management ---
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({ checkInDate: '', checkOutDate: '' });
    
    // --- Hooks ---
    const { id } = useParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const token = localStorage.getItem('token');

    // --- Data Fetching ---
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await getListing(id);
                setListing(response.data);
            } catch (err) {
                console.error("Failed to fetch listing", err);
                setError("Could not load listing details.");
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    // --- Event Handlers ---
    const handleBookingChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    // This is the new function that triggers the Stripe payment flow
    const handleReserveClick = async () => {
        setError(''); // Clear previous errors

        // 1. Check if user is logged in
        if (!token) {
            navigate('/login');
            return;
        }

        // 2. Validate inputs
        if (!bookingData.checkInDate || !bookingData.checkOutDate) {
            setError('Please select check-in and check-out dates.');
            return;
        }

        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const dayDifference = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

        if (dayDifference <= 0) {
            setError('Check-out date must be after check-in date.');
            return;
        }
        
        // 3. Prepare data for Stripe session
        const checkoutDetails = {
            listing: {
                _id: listing._id,
                title: listing.title,
                imageUrl: listing.imageUrl,
            },
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            totalPrice: listing.pricePerNight * dayDifference
        };

        try {
            // 4. Create the Checkout Session on the backend
            const response = await createCheckoutSession(checkoutDetails,token);
            const sessionId = response.data.id;

            // 5. Redirect to Stripe's hosted checkout page
            const { error } = await stripe.redirectToCheckout({ sessionId });
            
            if (error) {
                console.error("Stripe redirect error", error);
                setError("Could not redirect to payment page. Please try again.");
            }

        } catch (err) {
            console.error('Stripe session creation failed:', err);
            setError('Could not initiate payment. Please try again.');
        }
    };
    
    // --- Render Logic ---
    if (loading) return <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading details...</p>;
    if (error && !listing) return <p style={{ color: 'red' }}>{error}</p>;
    if (!listing) return <p>Listing not found.</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{listing.title}</h1>
            <p style={{ marginTop: '-1rem', color: '#666' }}>{listing.location.city}, {listing.location.country}</p>

            <img src={listing.imageUrl} alt={listing.title} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem' }} />

            <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row' }}>
                <div style={{ flex: 2 }}>
                    <h2>Hosted by {listing.host.name}</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{listing.description}</p>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={bookingWidgetStyle}>
                        <h3>${listing.pricePerNight} <span style={{fontWeight: 300, fontSize: '1rem'}}>/ night</span></h3>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }}/>
                        
                        {/* The form tag is removed, as we trigger the action with a button click */}
                        <div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                <div style={{flex: 1}}>
                                    <label style={{fontSize: '0.8rem', fontWeight: 600}}>CHECK-IN</label>
                                    <input type="date" name="checkInDate" style={dateInputStyle} onChange={handleBookingChange} />
                                </div>
                                <div style={{flex: 1}}>
                                    <label style={{fontSize: '0.8rem', fontWeight: 600}}>CHECKOUT</label>
                                    <input type="date" name="checkOutDate" style={dateInputStyle} onChange={handleBookingChange} />
                                </div>
                            </div>
                            
                            {/* The button is now type="button" and uses onClick */}
                            <button type="button" onClick={handleReserveClick} style={reserveButtonStyle}>
                                {token ? 'Reserve' : 'Login to Reserve'}
                            </button>
                            
                            {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem', marginTop: '10px' }}>{error}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '3rem' }}>
                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }}/>
                <h2>Where you'll be</h2>
                <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                    <Map listings={[listing]} />
                </div>
            </section>
        </div>
    );
};

// --- Styles ---
const bookingWidgetStyle = { 
    border: '1px solid #ddd', 
    borderRadius: '12px', 
    padding: '1.5rem', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    position: 'sticky', // Makes the widget "stick" as you scroll
    top: '20px' 
};
const dateInputStyle = { 
    width: '100%', 
    padding: '10px', 
    marginTop: '5px', 
    borderRadius: '8px', 
    border: '1px solid #ccc',
    boxSizing: 'border-box'
};
const reserveButtonStyle = { 
    width: '100%', 
    padding: '12px', 
    fontSize: '1rem', 
    cursor: 'pointer', 
    backgroundColor: '#FF5A5F', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px',
    fontWeight: 600
};

export default ListingDetailPage;