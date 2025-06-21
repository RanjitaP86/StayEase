import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); 
            navigate('/');
            window.location.reload(); // Force reload to update navbar
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed. Check console for details.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
            <button type="submit" style={buttonStyle}>Login</button>
        </form>
    );
};

// Simple Form Styles
const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '50px auto' };
const inputStyle = { margin: '10px 0', padding: '10px', fontSize: '1rem' };
const buttonStyle = { padding: '10px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' };

export default LoginPage;