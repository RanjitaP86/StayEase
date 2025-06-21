import React, { useState } from 'react';

// This component receives a function `onSearch` to pass the filters up to HomePage
const SearchBar = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Pass the filter values to the parent component (HomePage)
        onSearch({ location, maxPrice });
    };

    return (
        <form onSubmit={handleSearch} style={searchBarStyle}>
            <input
                type="text"
                placeholder="Where are you going?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
            />
            <input
                type="number"
                placeholder="Max price ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ ...inputStyle, width: '150px' }}
            />
            <button type="submit" style={buttonStyle}>Search</button>
        </form>
    );
};

// --- Styles ---
const searchBarStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    padding: '1.5rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    margin: '0 auto 3rem auto',
    maxWidth: '800px',
};
const inputStyle = {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
};
const buttonStyle = {
    padding: '0 2rem',
    border: 'none',
    background: '#FF5A5F',
    color: 'white',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
};

export default SearchBar;