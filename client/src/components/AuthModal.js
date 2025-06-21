import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import './AuthModal.css'; // We'll create this CSS file next
import googleIcon from '../assets/google-icon.svg'; // You'll need to add these SVGs
import appleIcon from '../assets/apple-icon.svg';

const AuthModal = ({ isOpen, onClose }) => {
    // 'view' can be 'main', 'emailLogin', or 'emailRegister'
    const [view, setView] = useState('main'); 
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { email, password } = formData;
            const response = await login({ email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onClose(); // Close modal on success
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed.');
        }
    };
    
    const handleEmailRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { name, email, password } = formData;
            const response = await register({ name, email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onClose();
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed.');
        }
    };
    
    // Function to reset state when closing or changing views
    const resetAndClose = () => {
        setFormData({ name: '', email: '', password: '' });
        setError('');
        setView('main');
        onClose();
    };

    const renderView = () => {
        switch (view) {
            case 'emailLogin':
                return (
                    <>
                        <h3 className="modal-title">Log in</h3>
                        <form onSubmit={handleEmailLogin}>
                            {error && <p className="error-message">{error}</p>}
                            <input type="email" name="email" placeholder="Email" required className="auth-input" onChange={handleInputChange} />
                            <input type="password" name="password" placeholder="Password" required className="auth-input" onChange={handleInputChange} />
                            <button type="submit" className="auth-button primary">Log in</button>
                        </form>
                        <button onClick={() => setView('emailRegister')} className="switch-view-link">Don't have an account? Sign up</button>
                    </>
                );
            case 'emailRegister':
                return (
                    <>
                        <h3 className="modal-title">Sign up</h3>
                        <form onSubmit={handleEmailRegister}>
                            {error && <p className="error-message">{error}</p>}
                            <input type="text" name="name" placeholder="Full Name" required className="auth-input" onChange={handleInputChange} />
                            <input type="email" name="email" placeholder="Email" required className="auth-input" onChange={handleInputChange} />
                            <input type="password" name="password" placeholder="Password" required className="auth-input" onChange={handleInputChange} />
                            <button type="submit" className="auth-button primary">Sign up</button>
                        </form>
                        <button onClick={() => setView('emailLogin')} className="switch-view-link">Already have an account? Log in</button>
                    </>
                );
            default: // 'main' view
                return (
                    <>
                        <h3 className="modal-title">Log in or sign up</h3>
                        <div className="welcome-text">
                            <h4>Welcome to StayFinder</h4>
                        </div>
                        <div className="social-login-options">
                            <button className="auth-button social"><img src={googleIcon} alt="Google" /> Continue with Google</button>
                            <button className="auth-button social"><img src={appleIcon} alt="Apple" /> Continue with Apple</button>
                            <div className="divider">or</div>
                            <button className="auth-button" onClick={() => setView('emailLogin')}>Continue with email</button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="modal-backdrop" onClick={resetAndClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={resetAndClose}>×</button>
                {renderView()}
            </div>
        </div>
    );
};

export default AuthModal;