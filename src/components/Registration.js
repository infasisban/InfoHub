import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import "./Registration.css";

function Registration() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            newErrors.phone = "Phone must be exactly 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setSuccess(false);

        try {
            await addDoc(collection(db, "users"), {
                name: name.trim(),
                email: email.trim(),
                phone,
                timestamp: new Date(),
            });

            setSuccess(true);
            setName("");
            setEmail("");
            setPhone("");
            setErrors({});

            // Auto-redirect after 2 seconds on success
            setTimeout(() => {
                navigate("/users");
            }, 2000);
        } catch (err) {
            console.error("Error adding document: ", err);
            alert("❌ Error submitting form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <div className="registration-header">
                    <h2 className="registration-title">Create Account</h2>
                    <p className="registration-subtitle">
                        Join our community by filling out the form below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                value={name}
                                onChange={handleInputChange(setName, "name")}
                                className={`form-control ${
                                    errors.name ? "error" : ""
                                }`}
                                placeholder="John Doe"
                                disabled={loading || success}
                            />
                        </div>
                        {errors.name && (
                            <span className="error-message">{errors.name}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-with-icon">
                            <input
                                type="email"
                                value={email}
                                onChange={handleInputChange(setEmail, "email")}
                                className={`form-control ${
                                    errors.email ? "error" : ""
                                }`}
                                placeholder="example@email.com"
                                disabled={loading || success}
                            />
                        </div>
                        {errors.email && (
                            <span className="error-message">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <div className="input-with-icon">
                            <input
                                type="tel"
                                value={phone}
                                onChange={handleInputChange(setPhone, "phone")}
                                className={`form-control ${
                                    errors.phone ? "error" : ""
                                }`}
                                placeholder="0712345678"
                                maxLength="10"
                                disabled={loading || success}
                            />
                        </div>
                        {errors.phone && (
                            <span className="error-message">
                                {errors.phone}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`submit-btn ${loading ? "loading" : ""} ${
                            success ? "success" : ""
                        }`}
                        disabled={loading || success}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Processing...
                            </>
                        ) : success ? (
                            "Registered Successfully!"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Success Message */}
                {success && (
                    <div className="success-message">
                        <div className="success-icon-container">
                            <svg
                                className="success-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="success-text">
                            <h3>Registration Successful!</h3>
                            <p>
                                Thank you for registering. Redirecting to users
                                page...
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="navigation-buttons">
                    <button
                        className="nav-btn secondary"
                        onClick={() => navigate("/")}
                        disabled={loading}
                    >
                        <FaArrowLeft className="btn-icon" />
                        Back to Home
                    </button>
                    <button
                        className="nav-btn primary"
                        onClick={() => navigate("/users")}
                        disabled={loading}
                    >
                        <FaUsers className="btn-icon" />
                        View All Users
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Registration;
