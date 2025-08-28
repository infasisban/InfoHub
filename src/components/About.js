import React from "react";
import { Link } from "react-router-dom";
import {
    FaReact,
    FaFire,
    FaMobile,
    FaUsers,
    FaRocket,
    FaHeart,
    FaArrowLeft,
    FaUserPlus,
    FaEye,
} from "react-icons/fa";
import "./About.css";

function About() {
    return (
        <div className="about-container">
            {/* Navigation */}
            <nav className="about-nav">
                <div className="nav-container">
                    <Link to="/" className="back-button">
                        <FaArrowLeft />
                        Back to Home
                    </Link>
                    <span className="nav-logo">InfoHub</span>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>About InfoHub</h1>
                    <p className="hero-subtitle">
                        Empowering users with seamless data management through
                        cutting-edge technology
                    </p>
                </div>
                <div className="hero-graphic">
                    <div className="graphic-element">
                        <div className="circle react">
                            <FaReact />
                        </div>
                        <div className="circle firebase">
                            <FaFire />
                        </div>
                        <div className="circle mobile">
                            <FaMobile />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="container">
                    <div className="mission-content">
                        <h2>Our Mission</h2>
                        <p>
                            At InfoHub, we're dedicated to creating intuitive,
                            powerful tools that simplify data management for
                            everyone. Our platform demonstrates how modern web
                            technologies can create seamless experiences that
                            work beautifully across all devices.
                        </p>
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="tech-section">
                <div className="container">
                    <h2>Technology Stack</h2>
                    <p className="tech-description">
                        InfoHub is built with cutting-edge technologies to
                        ensure performance, reliability, and scalability.
                    </p>
                    <div className="tech-grid">
                        <div className="tech-card">
                            <div className="tech-icon react">
                                <FaReact />
                            </div>
                            <h3>React</h3>
                            <p>
                                A powerful JavaScript library for building user
                                interfaces with reusable components.
                            </p>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon firebase">
                                <FaFire />
                            </div>
                            <h3>Firebase</h3>
                            <p>
                                Google's platform that provides backend services
                                including realtime database and authentication.
                            </p>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon responsive">
                                <FaMobile />
                            </div>
                            <h3>Responsive Design</h3>
                            <p>
                                Ensures seamless experience across all devices
                                from mobile to desktop.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Highlight */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose InfoHub?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaUsers />
                            </div>
                            <h3>User Management</h3>
                            <p>
                                Easily register, view, and manage users with our
                                intuitive interface.
                            </p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaMobile />
                            </div>
                            <h3>Mobile-First</h3>
                            <p>
                                Designed with mobile users in mind, ensuring
                                great experience on any device.
                            </p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaRocket />
                            </div>
                            <h3>Fast & Reliable</h3>
                            <p>
                                Built for performance with quick load times and
                                smooth interactions.
                            </p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaHeart />
                            </div>
                            <h3>User-Friendly</h3>
                            <p>
                                Simple, clean interface that makes data
                                management accessible to everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Development Purpose */}
            <section className="purpose-section">
                <div className="container">
                    <div className="purpose-content">
                        <h2>Development Purpose</h2>
                        <p>
                            This application was created to demonstrate modern
                            mobile app development skills using React and
                            Firebase. It showcases best practices in responsive
                            design, state management, and integration with
                            backend services.
                        </p>
                        <p>
                            Whether you're a developer looking to learn or a
                            business seeking efficient data management
                            solutions, InfoHub represents the power of
                            contemporary web technologies to create practical,
                            user-friendly applications.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="about-cta">
                <div className="container">
                    <h2>Ready to Get Started?</h2>
                    <p>
                        Join our growing community of users who are simplifying
                        their data management with InfoHub.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/registration" className="cta-button primary">
                            <FaUserPlus className="cta-icon" />
                            Register Now
                        </Link>
                        <Link to="/users" className="cta-button secondary">
                            <FaEye className="cta-icon" />
                            View Users
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="about-footer">
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

export default About;
