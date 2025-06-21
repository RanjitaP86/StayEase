import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css'; // We'll create this CSS file next

const PropertyCard = ({ listing, className = '' }) => {
    // The className prop allows us to pass 'card--large', 'card--tall', etc.
    const cardClasses = `property-card ${className}`;

    return (
        <Link to={`/listing/${listing._id}`} className={cardClasses}>
            <img src={listing.imageUrl} alt={listing.title} />
            <div className="card-price">${listing.pricePerNight}</div>
            <div className="card-info">
                <h3>{listing.title}</h3>
                <p>{listing.location.city}, {listing.location.country}</p>
            </div>
        </Link>
    );
};

export default PropertyCard;