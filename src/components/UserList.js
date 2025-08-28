import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import {
    FaEnvelope,
    FaPhone,
    FaTrash,
    FaEdit,
    FaSearch,
    FaUser,
    FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./UserList.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userData);
            } catch (err) {
                console.error("Error fetching users:", err);
                alert("Error loading users. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Handle sorting
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Sort users
    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        if (sortConfig.key) {
            sortableUsers.sort((a, b) => {
                const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
                const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";

                if (aVal < bVal) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [users, sortConfig]);

    // Filter by search term
    const filteredUsers = sortedUsers.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm),
    );

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setDeletingId(id);
            try {
                await deleteDoc(doc(db, "users", id));
                setUsers(users.filter((user) => user.id !== id));
            } catch (err) {
                console.error(err);
                alert("Error deleting user. Please try again.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    // Format timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="userlist-container">
                <div className="userlist-loading">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="userlist-container">
            <div className="userlist-header">
                <Link to="/" className="back-button">
                    <FaArrowLeft />
                    Back to Home
                </Link>
                <h1>Registered Users</h1>
                <p className="userlist-subtitle">
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1 ? "s" : ""} found
                </p>
            </div>

            <div className="userlist-content">
                {/* Search Input */}
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchTerm("")}
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Users List */}
                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <FaUser className="empty-icon" />
                        <h3>No users found</h3>
                        <p>Try adjusting your search or register new users</p>
                        <Link to="/registration" className="cta-button">
                            Register New User
                        </Link>
                    </div>
                ) : (
                    <div className="users-grid">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="user-card">
                                <div className="user-card-header">
                                    <h3 className="user-name">{user.name}</h3>
                                    <div className="user-actions">
                                        <button className="action-btn edit-btn">
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            disabled={deletingId === user.id}
                                        >
                                            {deletingId === user.id ? (
                                                <div className="mini-spinner"></div>
                                            ) : (
                                                <FaTrash />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="user-details">
                                    <div className="user-detail">
                                        <FaEnvelope className="detail-icon" />
                                        <span className="detail-text">
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className="user-detail">
                                        <FaPhone className="detail-icon" />
                                        <span className="detail-text">
                                            {user.phone}
                                        </span>
                                    </div>
                                    {user.timestamp && (
                                        <div className="user-detail">
                                            <span className="detail-label">
                                                Registered:
                                            </span>
                                            <span className="detail-text">
                                                {formatDate(user.timestamp)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;
