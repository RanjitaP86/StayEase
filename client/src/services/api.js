import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // The proxy will handle the full URL
});

// Function to get all listings
export const getListings = (queryParams = '') => api.get(`/listings${queryParams}`);

// Function to get a single listing
export const getListing = (id) => api.get(`/listings/${id}`);

// Auth functions
export const login = (userData) => api.post('/auth/login', userData);
export const register = (userData) => api.post('/auth/register', userData);

export const addListing = (listingData, token) => {
    // The API request must include the auth token in the headers
    const config = {
        headers: {
            'x-auth-token': token
        }
    };
    return api.post('/listings', listingData, config);
};
export const createBooking = (bookingData, token) => {
    const config = {
        headers: {
            'x-auth-token': token
        }
    };
    return api.post('/bookings', bookingData, config);
};

export const getMyBookings = (token) => {
    const config = {
        headers: { 'x-auth-token': token }
    };
    return api.get('/bookings/my-bookings', config);
};

export const createCheckoutSession = (bookingData, token) => {
    const config = {
        headers: {
            'x-auth-token': token
        }
    };
    return api.post('/payments/create-checkout-session', bookingData, config);
};

export default api;