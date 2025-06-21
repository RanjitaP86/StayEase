import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createBooking } from '../services/api';

const BookingSuccessPage = () => {
    const [status, setStatus] = useState('processing');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const createBookingFromStripe = async () => {
            const query = new URLSearchParams(location.search);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication error. Please log in.');
                setStatus('failed');
                return;
            }

            const bookingDetails = {
                listing: query.get('listingId'),
                checkInDate: query.get('checkInDate'),
                checkOutDate: query.get('checkOutDate'),
                totalPrice: parseFloat(query.get('totalPrice')),
            };

            try {
                await createBooking(bookingDetails, token);
                setStatus('success');
            } catch (err) {
                console.error('Failed to create booking after payment', err);
                setError('There was an issue saving your booking. Please contact support.');
                setStatus('failed');
            }
        };

        createBookingFromStripe();
    }, [location.search, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            {status === 'processing' && <h2>Processing your booking...</h2>}
            {status === 'success' && (
                <>
                    <h1 style={{color: 'green'}}>Booking Confirmed!</h1>
                    <p>Your payment was successful and your trip is booked.</p>
                    <Link to="/my-bookings">View Your Bookings</Link>
                </>
            )}
            {status === 'failed' && (
                <>
                    <h1 style={{color: 'red'}}>Booking Failed</h1>
                    <p>{error}</p>
                    <Link to="/">Return to Homepage</Link>
                </>
            )}
        </div>
    );
};

export default BookingSuccessPage;