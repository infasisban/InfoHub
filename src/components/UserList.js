import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import {
    FaSortUp,
    FaSortDown,
    FaEnvelope,
    FaPhone,
    FaSearch,
    FaEdit,
    FaTrash,
    FaTimes,
    FaUser,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "./UserList.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingUser, setEditingUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [deleteUserName, setDeleteUserName] = useState("");

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                const querySnapshot = await getDocs(collection(db, "users"));
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Sorting
    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        if (sortConfig.key) {
            sortableUsers.sort((a, b) => {
                const aVal = (a[sortConfig.key] ?? "").toString().toLowerCase();
                const bVal = (b[sortConfig.key] ?? "").toString().toLowerCase();
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableUsers;
    }, [users, sortConfig]);

    const filteredUsers = sortedUsers.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm),
    );

    const sortBy = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc")
            direction = "desc";
        setSortConfig({ key, direction });
    };

    // Delete User
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "users", deleteUserId));
            setUsers(users.filter((u) => u.id !== deleteUserId));
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
            setError("Error deleting user. Please try again.");
        }
    };

    // Edit User
    const handleEdit = (user) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
    };

    // Update User
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, "users", editingUser.id);
            await updateDoc(userRef, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
            });
            setUsers(
                users.map((u) =>
                    u.id === editingUser.id
                        ? {
                              ...u,
                              name: name.trim(),
                              email: email.trim(),
                              phone: phone.trim(),
                          }
                        : u,
                ),
            );
            setEditingUser(null);
        } catch (err) {
            console.error(err);
            setError("Error updating user. Please try again.");
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="user-list-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <h2>Registered Users</h2>
                <p>Manage all registered users in the system</p>
            </div>

            {/* Search Box */}
            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="clear-search"
                        onClick={() => setSearchTerm("")}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-alert">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* No Users Message */}
            {!loading && users.length === 0 && (
                <div className="empty-state">
                    <FaUser className="empty-icon" />
                    <h3>No Users Found</h3>
                    <p>There are no registered users in the system yet.</p>
                </div>
            )}

            {/* No Search Results Message */}
            {users.length > 0 && filteredUsers.length === 0 && (
                <div className="empty-state">
                    <FaSearch className="empty-icon" />
                    <h3>No Matching Users</h3>
                    <p>
                        Try adjusting your search terms to find what you're
                        looking for.
                    </p>
                </div>
            )}

            {/* Table View */}
            {filteredUsers.length > 0 && (
                <>
                    <div className="d-none d-md-block table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th onClick={() => sortBy("name")}>
                                        <div className="table-header">
                                            Name
                                            {sortConfig.key === "name" &&
                                                (sortConfig.direction ===
                                                "asc" ? (
                                                    <FaSortUp className="sort-icon" />
                                                ) : (
                                                    <FaSortDown className="sort-icon" />
                                                ))}
                                        </div>
                                    </th>
                                    <th onClick={() => sortBy("email")}>
                                        <div className="table-header">
                                            Email
                                            {sortConfig.key === "email" &&
                                                (sortConfig.direction ===
                                                "asc" ? (
                                                    <FaSortUp className="sort-icon" />
                                                ) : (
                                                    <FaSortDown className="sort-icon" />
                                                ))}
                                        </div>
                                    </th>
                                    <th onClick={() => sortBy("phone")}>
                                        <div className="table-header">
                                            Phone
                                            {sortConfig.key === "phone" &&
                                                (sortConfig.direction ===
                                                "asc" ? (
                                                    <FaSortUp className="sort-icon" />
                                                ) : (
                                                    <FaSortDown className="sort-icon" />
                                                ))}
                                        </div>
                                    </th>
                                    <th>Registered On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.name
                                                        ? user.name
                                                              .charAt(0)
                                                              .toUpperCase()
                                                        : "U"}
                                                </div>
                                                <div className="user-details">
                                                    <div className="user-name">
                                                        {user.name ?? "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="email-cell">
                                                <FaEnvelope className="cell-icon" />
                                                {user.email ?? "N/A"}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="phone-cell">
                                                <FaPhone className="cell-icon" />
                                                {user.phone ?? "N/A"}
                                            </div>
                                        </td>
                                        <td>{formatDate(user.timestamp)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                    title="Edit user"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => {
                                                        setDeleteUserId(
                                                            user.id,
                                                        );
                                                        setDeleteUserName(
                                                            user.name,
                                                        );
                                                        setShowDeleteModal(
                                                            true,
                                                        );
                                                    }}
                                                    title="Delete user"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card View for Mobile */}
                    <div className="d-block d-md-none cards-container">
                        {filteredUsers.map((user) => (
                            <div className="user-card" key={user.id}>
                                <div className="card-header">
                                    <div className="user-avatar large">
                                        {user.name
                                            ? user.name.charAt(0).toUpperCase()
                                            : "U"}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">
                                            {user.name ?? "N/A"}
                                        </div>
                                        <div className="user-joined">
                                            Joined {formatDate(user.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <div className="detail-item">
                                        <FaEnvelope className="detail-icon" />
                                        <span>{user.email ?? "N/A"}</span>
                                    </div>
                                    <div className="detail-item">
                                        <FaPhone className="detail-icon" />
                                        <span>{user.phone ?? "N/A"}</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => {
                                            setDeleteUserId(user.id);
                                            setDeleteUserName(user.name);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Edit Form Modal */}
            {editingUser && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <div className="modal-header">
                            <h3>Edit User</h3>
                            <button
                                className="close-button"
                                onClick={handleCancelEdit}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="edit-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-update">
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                className="delete-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="delete-confirmation">
                        <div className="delete-warning">
                            <FaTrash className="warning-icon" />
                        </div>
                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{deleteUserName}</strong>? This action
                            cannot be undone.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        className="btn-cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="btn-confirm-delete"
                    >
                        Delete User
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserList;
