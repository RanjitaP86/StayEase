import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// --- Stripe Imports ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// --- Component and Page Imports ---
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddListingPage from './pages/AddListingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingSuccessPage from './pages/BookingSuccessPage'; // The new page for Stripe success
import Footer from './components/Footer'; 
import AuthModal from './components/AuthModal';

import './App.css';

// --- Stripe Initialization ---
// Place your actual Stripe publishable key here. It is safe to be public.
// Remember to use your TEST key.
const stripePromise = loadStripe('pk_test_51RaWquQlMroQ8piG0jwdQ0rInD5RKLJ5FdHB6l0qAjdSTCzq0t0m90nA141oztrBvJD3IgQTqz9ILXETCmAfklKr00gXvKU4TB');

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    // The Elements provider from Stripe must wrap your entire application
    // so that any component can access the Stripe object via hooks.
    <Elements stripe={stripePromise}>
      <Router>
        <div className="app-container">
        <Navbar onLoginClick={() => setIsAuthModalOpen(true)} /> 
        
        <main className="container">
          <Routes>
            {/* All your existing application routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} /> 
            <Route path="/add-listing" element={<AddListingPage />} />

            {/* The new route for handling successful Stripe payments */}
            <Route path="/booking/success" element={<BookingSuccessPage />} />
          </Routes>
        </main>
        <Footer />
        </div>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </Router>
    </Elements>
  );
}

export default App;