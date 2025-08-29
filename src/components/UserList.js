import React, { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../firebase";
import {
    collection,
    doc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    limit,
    startAfter,
    getCountFromServer,
} from "firebase/firestore";
import {
    FaEnvelope,
    FaPhone,
    FaTrash,
    FaEdit,
    FaSearch,
    FaUser,
    FaArrowLeft,
    FaTimes,
    FaDownload,
    FaFilter,
    FaUserShield,
    FaUserTag,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./UserList.css";

// Number of users per page
const USERS_PER_PAGE = 12;

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "timestamp",
        direction: "descending",
    });
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "user",
    });
    const [lastVisible, setLastVisible] = useState(null);
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [bulkAction, setBulkAction] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [roleFilter, setRoleFilter] = useState("all");
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Available user roles
    const userRoles = [
        { value: "user", label: "User", icon: <FaUserTag /> },
        { value: "admin", label: "Admin", icon: <FaUserShield /> },
    ];

    // Fetch users count
    useEffect(() => {
        const fetchUsersCount = async () => {
            try {
                const coll = collection(db, "users");
                const snapshot = await getCountFromServer(coll);
                setTotalUsers(snapshot.data().count);
            } catch (err) {
                console.error("Error fetching users count:", err);
            }
        };

        fetchUsersCount();
    }, []);

    // Fetch users from Firestore with real-time updates
    useEffect(() => {
        setLoading(true);

        let usersQuery = query(collection(db, "users"));

        // Apply filters if any
        if (roleFilter !== "all") {
            usersQuery = query(usersQuery, where("role", "==", roleFilter));
        }

        // Apply sorting
        usersQuery = query(
            usersQuery,
            orderBy(
                sortConfig.key,
                sortConfig.direction === "ascending" ? "asc" : "desc",
            ),
            limit(USERS_PER_PAGE),
        );

        // Apply pagination
        if (page > 1 && lastVisible) {
            usersQuery = query(usersQuery, startAfter(lastVisible));
        }

        const unsubscribe = onSnapshot(
            usersQuery,
            (querySnapshot) => {
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUsers(userData);

                // Update last visible document for pagination
                if (querySnapshot.docs.length > 0) {
                    setLastVisible(
                        querySnapshot.docs[querySnapshot.docs.length - 1],
                    );
                }

                setLoading(false);
            },
            (err) => {
                console.error("Error fetching users:", err);
                setError("Error loading users. Please try again.");
                setLoading(false);
            },
        );

        return () => unsubscribe();
        // This is the dependency array + eslint disable comment
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortConfig, roleFilter]);

    // Handle sorting
    const handleSort = useCallback(
        (key) => {
            let direction = "ascending";
            if (
                sortConfig.key === key &&
                sortConfig.direction === "ascending"
            ) {
                direction = "descending";
            }
            setSortConfig({ key, direction });
            setPage(1); // Reset to first page when sorting changes
        },
        [sortConfig],
    );
    const resizeObserverErr = (e) => {
        if (
            e.message !==
            "ResizeObserver loop completed with undelivered notifications."
        ) {
            console.error(e);
        }
    };

    window.addEventListener("error", resizeObserverErr);

    // Filter by search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;

        return users.filter(
            (user) =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm),
        );
    }, [users, searchTerm]);

    // Handle delete user
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setDeletingId(id);
            try {
                await deleteDoc(doc(db, "users", id));
                // Remove from selected users if it was selected
                if (selectedUsers.has(id)) {
                    const newSelected = new Set(selectedUsers);
                    newSelected.delete(id);
                    setSelectedUsers(newSelected);
                }
            } catch (err) {
                console.error(err);
                setError("Error deleting user. Please try again.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedUsers.size === 0) return;

        if (
            window.confirm(
                `Are you sure you want to delete ${selectedUsers.size} users?`,
            )
        ) {
            try {
                const deletePromises = Array.from(selectedUsers).map((id) =>
                    deleteDoc(doc(db, "users", id)),
                );

                await Promise.all(deletePromises);
                setSelectedUsers(new Set());
                setBulkAction("");
            } catch (err) {
                console.error(err);
                setError("Error deleting users. Please try again.");
            }
        }
    };

    // Handle edit form input changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    // Handle edit form submission
    const handleEditFormSubmit = async (e) => {
        e.preventDefault();

        if (!editingUser) return;

        try {
            // Update user in Firestore
            const userRef = doc(db, "users", editingUser.id);
            await updateDoc(userRef, editFormData);

            // Close the modal
            setEditingUser(null);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating user:", err);
            setError("Error updating user. Please try again.");
        }
    };

    // Handle user selection
    const toggleUserSelection = (id) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedUsers(newSelected);
    };

    // Export users data
    const exportUsers = () => {
        const dataToExport = filteredUsers.map((user) => ({
            Name: user.name,
            Email: user.email,
            Phone: user.phone,
            Role: user.role || "user",
            "Registered At": user.timestamp
                ? formatDate(user.timestamp)
                : "N/A",
        }));

        const csvContent = [
            Object.keys(dataToExport[0]).join(","),
            ...dataToExport.map((row) => Object.values(row).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "users.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    // Calculate pagination values
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
    const startIndex = (page - 1) * USERS_PER_PAGE + 1;
    const endIndex = Math.min(startIndex + USERS_PER_PAGE - 1, totalUsers);

    // Handle page change
    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    if (loading && page === 1) {
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
            {/* Error Message */}
            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button
                        onClick={() => setError("")}
                        className="error-close"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button
                                className="close-modal"
                                onClick={() => {
                                    setEditingUser(null);
                                    setIsEditing(false);
                                }}
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form
                            onSubmit={handleEditFormSubmit}
                            className="edit-form"
                        >
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={editFormData.role}
                                    onChange={handleEditFormChange}
                                    className="role-select"
                                >
                                    {userRoles.map((role) => (
                                        <option
                                            key={role.value}
                                            value={role.value}
                                        >
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setEditingUser(null);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="userlist-header">
                <Link to="/" className="back-button">
                    <FaArrowLeft />
                    Back to Home
                </Link>
                <h1>Registered Users</h1>
                <p className="userlist-subtitle">
                    Showing {startIndex}-{endIndex} of {totalUsers} users
                </p>
            </div>

            <div className="userlist-content">
                {/* Action Bar */}
                <div className="action-bar">
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
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <button
                            className="filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                            aria-expanded={showFilters}
                        >
                            <FaFilter />
                            Filters
                        </button>

                        <button
                            className="export-btn"
                            onClick={exportUsers}
                            disabled={filteredUsers.length === 0}
                        >
                            <FaDownload />
                            Export
                        </button>
                    </div>

                    {showFilters && (
                        <div className="filters-panel">
                            <div className="filter-group">
                                <label htmlFor="roleFilter">
                                    Filter by Role:
                                </label>
                                <select
                                    id="roleFilter"
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                >
                                    <option value="all">All Roles</option>
                                    {userRoles.map((role) => (
                                        <option
                                            key={role.value}
                                            value={role.value}
                                        >
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {selectedUsers.size > 0 && (
                        <div className="bulk-actions">
                            <span>{selectedUsers.size} user(s) selected</span>
                            <select
                                value={bulkAction}
                                onChange={(e) => setBulkAction(e.target.value)}
                                className="bulk-action-select"
                            >
                                <option value="">Bulk Actions</option>
                                <option value="delete">Delete Selected</option>
                                <option value="makeAdmin">Make Admin</option>
                                <option value="makeUser">Make User</option>
                            </select>
                            <button
                                onClick={() => {
                                    if (bulkAction === "delete")
                                        handleBulkDelete();
                                }}
                                className="apply-bulk-action"
                                disabled={!bulkAction}
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>

                {/* Sorting Buttons */}
                <div className="sort-buttons">
                    <span>Sort by: </span>
                    <button
                        onClick={() => handleSort("name")}
                        aria-pressed={sortConfig.key === "name"}
                    >
                        Name{" "}
                        {sortConfig.key === "name"
                            ? sortConfig.direction === "ascending"
                                ? "↑"
                                : "↓"
                            : ""}
                    </button>
                    <button
                        onClick={() => handleSort("email")}
                        aria-pressed={sortConfig.key === "email"}
                    >
                        Email{" "}
                        {sortConfig.key === "email"
                            ? sortConfig.direction === "ascending"
                                ? "↑"
                                : "↓"
                            : ""}
                    </button>
                    <button
                        onClick={() => handleSort("phone")}
                        aria-pressed={sortConfig.key === "phone"}
                    >
                        Phone{" "}
                        {sortConfig.key === "phone"
                            ? sortConfig.direction === "ascending"
                                ? "↑"
                                : "↓"
                            : ""}
                    </button>
                    <button
                        onClick={() => handleSort("timestamp")}
                        aria-pressed={sortConfig.key === "timestamp"}
                    >
                        Date{" "}
                        {sortConfig.key === "timestamp"
                            ? sortConfig.direction === "ascending"
                                ? "↑"
                                : "↓"
                            : ""}
                    </button>
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
                    <>
                        <div className="users-grid">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="user-card">
                                    <div className="user-card-header">
                                        <div className="user-selection">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.has(
                                                    user.id,
                                                )}
                                                onChange={() =>
                                                    toggleUserSelection(user.id)
                                                }
                                                aria-label={`Select ${user.name}`}
                                            />
                                        </div>
                                        <h3 className="user-name">
                                            {user.name}
                                        </h3>
                                        <div className="user-role">
                                            {user.role === "admin" ? (
                                                <FaUserShield title="Admin" />
                                            ) : (
                                                <FaUserTag title="User" />
                                            )}
                                            <span className="sr-only">
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="user-actions">
                                            <Link
                                                to={`/edit/${user.id}`}
                                                className="action-btn edit-btn"
                                                aria-label={`Edit ${user.name}`}
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                disabled={
                                                    deletingId === user.id
                                                }
                                                aria-label={`Delete ${user.name}`}
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page === 1}
                                    className="pagination-btn"
                                >
                                    Previous
                                </button>

                                <div className="pagination-pages">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1,
                                    )
                                        .filter(
                                            (p) =>
                                                p === 1 ||
                                                p === totalPages ||
                                                (p >= page - 1 &&
                                                    p <= page + 1),
                                        )
                                        .map((p, i, arr) => {
                                            // Add ellipsis for gaps in pagination
                                            const showEllipsis =
                                                i > 0 && p - arr[i - 1] > 1;
                                            return (
                                                <React.Fragment key={p}>
                                                    {showEllipsis && (
                                                        <span className="pagination-ellipsis">
                                                            ...
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            goToPage(p)
                                                        }
                                                        className={`pagination-btn ${
                                                            p === page
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        aria-current={
                                                            p === page
                                                                ? "page"
                                                                : undefined
                                                        }
                                                    >
                                                        {p}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        })}
                                </div>

                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page === totalPages}
                                    className="pagination-btn"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default UserList;
