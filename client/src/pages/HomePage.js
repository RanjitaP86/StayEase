import React, { useState, useEffect } from 'react';
import { getListings } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
 // Import the Footer
import './HomePage.css';

// Helper function to assign grid layout classes
const getCardClass = (layout) => {
    switch (layout) {
        case 'large': return 'card--large';
        case 'tall': return 'card--tall';
        case 'wide': return 'card--wide';
        default: return '';
    }
};

const HomePage = () => {
    // --- State Management ---
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching and Filtering ---
    useEffect(() => {
        // Fetch all listings on initial component mount
        handleSearch({}); 
    }, []);

    const handleSearch = async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters.location) {
                queryParams.append('location', filters.location);
            }
            if (filters.maxPrice) {
                queryParams.append('maxPrice', filters.maxPrice);
            }

            const response = await getListings(`?${queryParams.toString()}`);
            
            const listingsWithLayout = response.data.map((listing, index) => {
                if (index === 0) return { ...listing, layout: 'large' };
                if (index === 2) return { ...listing, layout: 'tall' };
                if (index === 5) return { ...listing, layout: 'wide' };
                return listing;
            });

            setListings(listingsWithLayout);

        } catch (err) {
            console.error('Failed to fetch listings:', err);
            setError('Could not load stays. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Conditional Render Logic ---
    const renderContent = () => {
        if (loading) {
            return <p className="status-message">Loading stays...</p>;
        }
        if (error) {
            return <p className="status-message error">{error}</p>;
        }
        if (listings.length === 0) {
            return <p className="status-message">No properties found matching your criteria.</p>;
        }
        return (
            <div className="listings-grid">
                {listings.map(listing => (
                    <PropertyCard
                        key={listing._id}
                        listing={listing}
                        className={getCardClass(listing.layout)}
                    />
                ))}
            </div>
        );
    };

    // --- Final JSX Structure ---
    return (
        <div>
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Your next getaway, found.</h1>
                    <p>Discover unique homes and experiences.</p>
                </div>
            </section>
            
            <SearchBar onSearch={handleSearch} />

            {/* This div contains the main content and is given a higher z-index */}
            <div className="page-content" style={{ display: 'flex', minHeight: '100vh' }}> 
                
                {/* This is the scrollable container for listings */}
                <div className="listings-container" style={{ flex: 1.5, overflowY: 'auto', padding: '1rem' }}>
                    <section className="listings-section">
                        <h2>Explore Stays Near You</h2>
                        {renderContent()}
                    </section>
                </div>
                
        
                
            </div>
            
        </div>
    );
};

export default HomePage;