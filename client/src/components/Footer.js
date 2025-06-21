import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // We'll create this CSS file next

const Footer = ({ className = '' }) => {
    const currentYear = new Date().getFullYear();
    const footerClasses = `site-footer ${className}`;

    return (
        <footer className={footerClasses}>
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-logo">StayFinder</h2>
                    <p>
                        Your next adventure is just a booking away. Discover unique stays and experiences around the world.
                    </p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact-form">
                    <h3>Contact Us</h3>
                    <form action="#" method="post">
                        <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
                        <textarea rows="2" name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-paper-plane"></i> Send
                        </button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                © {currentYear} StayFinder | Designed with ❤️
            </div>
        </footer>
    );
};

export default Footer;