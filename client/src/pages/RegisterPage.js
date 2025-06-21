import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // --- Client-side validation ---
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false); // Stop loading since we didn't make a request
            return; // Exit the function
        }

        try {
            // We don't need to send confirmPassword to the backend
            const { name, email, password } = formData;
            const response = await register({ name, email, password });

            localStorage.setItem('token', response.data.token);
            navigate('/');
            window.location.reload();

        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Create an Account</h2>
            {error && <p style={errorStyle}>{error}</p>}
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
            />
            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};


// --- Styles ---
const formStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    maxWidth: '400px', 
    margin: '50px auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    background: '#fff',
};

const inputStyle = { 
    margin: '10px 0', 
    padding: '12px', 
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
};

const buttonStyle = { 
    padding: '12px', 
    fontSize: '1rem', 
    cursor: 'pointer', 
    backgroundColor: '#28a745', // Kept original green color
    color: 'white', 
    border: 'none',
    borderRadius: '4px',
    marginTop: '1rem',
};

const errorStyle = {
    color: '#D8000C',
    backgroundColor: '#FFD2D2',
    border: '1px solid #D8000C',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
    marginBottom: '1rem',
};

export default RegisterPage;