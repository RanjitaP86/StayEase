// client/src/components/Navbar.js (FINAL, CORRECTED VERSION)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/STAY1.PNG'; // Make sure this path to your logo is correct
import './Navbar.css'; // We will use a separate CSS file for styles

const Navbar = ({ onLoginClick }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // --- THE FIX ---
    // This safely checks if 'user' exists in localStorage before parsing it.
    const userItem = localStorage.getItem('user');
    let user = null;
    if (userItem) {
        try {
            user = JSON.parse(userItem);
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            user = null;
        }
    }
    // --- END OF FIX ---

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="site-navbar">
            <Link to="/">
                <img src={logo} alt="StayFinder Logo" className="navbar-logo" />
            </Link>

            <div className="nav-links">
                {token && user ? (
                    // --- Logged-In User View ---
                    <>
                        {user.role === 'admin' && (
                            <Link to="/add-listing" className="nav-button">Add Property</Link>
                        )}
                        <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </>
                ) : (
                    // --- Logged-Out User View ---
                    <button onClick={onLoginClick} className="nav-button">Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;