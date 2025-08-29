import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    FaArrowLeft,
    FaSave,
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaUserShield,
    FaUserTag,
} from "react-icons/fa";
import "./EditUser.css";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "user",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch user by ID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    alert("User not found!");
                    navigate("/users");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error);
                alert("Failed to load user data.");
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, navigate]);

    // Handle form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, formData);
            alert("User updated successfully!");
            navigate("/users"); // redirect back to user list
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-user-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-user-container">
            <div className="edit-user-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/users")}
                >
                    <FaArrowLeft />
                    Back to Users
                </button>
                <h1>Edit User</h1>
                <p className="user-id">ID: {id}</p>
            </div>

            <div className="edit-user-content">
                <form onSubmit={handleSubmit} className="edit-user-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            <FaUser className="input-icon" />
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter user's full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope className="input-icon" />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter user's email address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            <FaPhone className="input-icon" />
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter user's phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            {formData.role === "admin" ? (
                                <FaUserShield className="input-icon" />
                            ) : (
                                <FaUserTag className="input-icon" />
                            )}
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="role-select"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/users")}
                        >
                            <FaTimes />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving ? (
                                <div className="button-spinner"></div>
                            ) : (
                                <FaSave />
                            )}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUser;
