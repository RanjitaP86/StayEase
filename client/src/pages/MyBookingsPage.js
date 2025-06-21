import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings } from '../services/api';
import BookingCard from '../components/BookingCard'; // We will create this next

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login if user is not authenticated
                navigate('/login');
                return;
            }

            try {
                const response = await getMyBookings(token);
                setBookings(response.data);
            } catch (err) {
                console.error('Failed to fetch bookings', err);
                setError('Could not load your bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [navigate]);

    if (loading) return <p className="status-message">Loading your bookings...</p>;
    if (error) return <p className="status-message error">{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <p className="status-message">You have no bookings yet. Time to plan a trip!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bookings.map(booking => (
                        <BookingCard key={booking._id} booking={booking} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;