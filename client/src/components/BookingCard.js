import React from 'react';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking }) => {
    // Helper to format dates for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // If for some reason the listing was deleted, booking.listing might be null
    if (!booking.listing) {
        return (
            <div style={cardStyle}>
                <p>This listing is no longer available.</p>
            </div>
        );
    }

    return (
        <div style={cardStyle}>
            <Link to={`/listing/${booking.listing._id}`}>
                <img src={booking.listing.imageUrl} alt={booking.listing.title} style={imageStyle} />
            </Link>
            <div style={detailsStyle}>
                <h3>{booking.listing.title}</h3>
                <p>{booking.listing.location.city}, {booking.listing.location.country}</p>
                <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                <div style={dateInfoStyle}>
                    <div>
                        <strong>Check-in:</strong> {formatDate(booking.checkInDate)}
                    </div>
                    <div>
                        <strong>Check-out:</strong> {formatDate(booking.checkOutDate)}
                    </div>
                </div>
                <div style={priceStyle}>
                    <strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

// --- Styles ---
const cardStyle = { display: 'flex', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' };
const imageStyle = { width: '250px', height: '100%', objectFit: 'cover' };
const detailsStyle = { padding: '1.5rem', flex: 1 };
const dateInfoStyle = { display: 'flex', justifyContent: 'space-between', margin: '1rem 0' };
const priceStyle = { textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' };

export default BookingCard;