import React from "react";
import { Link } from "react-router-dom";
import {
    FaUserPlus,
    FaUsers,
    FaMobile,
    FaChartLine,
    FaShieldAlt,
    FaSync,
    FaInfoCircle,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import "./Home.css";

function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="home-container">
            {/* Navigation */}
            <nav className="home-nav">
                <div className="nav-container">
                    <span className="nav-logo">InfoHub</span>
                    <div
                        className={`nav-links ${
                            mobileMenuOpen ? "active" : ""
                        }`}
                    >
                        <Link
                            to="/"
                            className="nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/registration"
                            className="nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Register
                        </Link>
                        <Link
                            to="/users"
                            className="nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Users
                        </Link>
                    </div>
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to InfoHub</h1>
                    <p className="hero-subtitle">
                        Streamline your data management with our powerful mobile
                        solution
                    </p>
                    <div className="hero-buttons">
                        <Link to="/registration" className="cta-button primary">
                            <FaUserPlus className="cta-icon" />
                            Get Started
                        </Link>
                        <Link to="/about" className="cta-button secondary">
                            <FaInfoCircle className="cta-icon" />
                            Learn More
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-card">
                        <div className="card-header">
                            <div className="card-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="data-item">
                                <span className="data-label">Users</span>
                                <span className="data-value">1,248</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Growth</span>
                                <span className="data-value positive">
                                    +24%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose InfoHub?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaMobile />
                            </div>
                            <h3>Mobile Optimized</h3>
                            <p>
                                Access your data from any device with our
                                responsive mobile application
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaChartLine />
                            </div>
                            <h3>Data Insights</h3>
                            <p>
                                Gain valuable insights with our analytics and
                                reporting tools
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>Secure & Safe</h3>
                            <p>
                                Your data is protected with enterprise-grade
                                security measures
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaSync />
                            </div>
                            <h3>Real-time Sync</h3>
                            <p>
                                Changes update instantly across all your devices
                                in real-time
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-number">10,000+</span>
                            <span className="stat-label">Active Users</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Get Started?</h2>
                        <p>
                            Join thousands of users who are already managing
                            their data efficiently with InfoHub
                        </p>
                        <div className="cta-buttons">
                            <Link
                                to="/registration"
                                className="cta-button primary"
                            >
                                <FaUserPlus className="cta-icon" />
                                Register Now
                            </Link>
                            <Link to="/users" className="cta-button secondary">
                                <FaUsers className="cta-icon" />
                                View Users
                            </Link>
                            <Link to="/about" className="cta-button secondary">
                                <FaInfoCircle className="cta-icon" />
                                About InfoHub
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>InfoHub</h3>
                            <p>
                                Streamlining data management for the modern
                                world
                            </p>
                        </div>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/about">About</Link>
                            <Link to="/registration">Register</Link>
                            <Link to="/users">Users</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2023 InfoHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
