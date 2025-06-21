// client/src/pages/AddListingPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addListing } from '../services/api'; // Make sure this function exists in api.js

const AddListingPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        pricePerNight: '',
        location: { city: '', country: '' },
        maxGuests: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['city', 'country', 'lat', 'lng'].includes(name)) {
        setFormData(prevState => ({
            ...prevState,
            location: { ...prevState.location, [name]: value }
        }));
    } else {
        setFormData({ ...formData, [name]: value });
    }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to add a property.');
                setLoading(false);
                return;
            }

            const response = await addListing(formData, token);
            // Navigate to the new listing's detail page on success
            navigate(`/listing/${response.data._id}`);

        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add listing. Please try again.');
            console.error('Add listing error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2>Add a New Property</h2>
                {error && <p style={errorStyle}>{error}</p>}

                <input type="text" name="title" placeholder="Property Title (e.g., Cozy Beachfront Villa)" value={formData.title} onChange={handleChange} required style={inputStyle} />
                <textarea name="description" placeholder="Detailed description of the property" value={formData.description} onChange={handleChange} required style={inputStyle} rows="4"></textarea>
                <input type="text" name="imageUrl" placeholder="Image URL (e.g., https://...)" value={formData.imageUrl} onChange={handleChange} required style={inputStyle} />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="number" name="pricePerNight" placeholder="Price per night ($)" value={formData.pricePerNight} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                    <input type="number" name="maxGuests" placeholder="Max guests" value={formData.maxGuests} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" name="city" placeholder="City" value={formData.location.city} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                    <input type="text" name="country" placeholder="Country" value={formData.location.country} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                </div>

                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="number" step="any" name="lat" placeholder="Latitude" value={formData.location.lat} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                    <input type="number" step="any" name="lng" placeholder="Longitude" value={formData.location.lng} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Submitting...' : 'Add Property'}
                </button>
            </form>
        </div>
    );
};

// --- Basic Styles ---
const pageStyle = { padding: '2rem' };
const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: 'auto', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: '#fff' };
const inputStyle = { margin: '10px 0', padding: '12px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' };
const buttonStyle = { padding: '12px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#FF5A5F', color: 'white', border: 'none', borderRadius: '4px', marginTop: '1rem' };
const errorStyle = { color: '#D8000C', backgroundColor: '#FFD2D2', border: '1px solid #D8000C', padding: '10px', borderRadius: '4px', textAlign: 'center' };

export default AddListingPage;