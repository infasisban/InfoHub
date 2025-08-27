import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaSortUp, FaSortDown, FaEnvelope, FaPhone } from "react-icons/fa";
import "./UserList.css"; // Make sure to create this CSS file

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Memoized sorting
    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        if (sortConfig.key !== null) {
            sortableUsers.sort((a, b) => {
                if (!a[sortConfig.key]) return 1;
                if (!b[sortConfig.key]) return -1;

                const aVal = a[sortConfig.key].toString().toLowerCase();
                const bVal = b[sortConfig.key].toString().toLowerCase();

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableUsers;
    }, [users, sortConfig]);

    // Filter users by search term
    const filteredUsers = sortedUsers.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortBy = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <p className="text-center mt-5">Loading users...</p>;
    if (!filteredUsers.length)
        return <p className="text-center mt-5">No users found.</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-primary"> Registered Users</h2>

            {/* Search Box */}
            <input
                type="text"
                placeholder="Search by name"
                className="form-control mb-4 shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Table View */}
            <div className="d-none d-md-block">
                <table className="table table-striped table-hover table-bordered shadow-sm rounded">
                    <thead className="table-dark">
                        <tr>
                            <th
                                onClick={() => sortBy("name")}
                                className={
                                    sortConfig.key === "name"
                                        ? "bg-primary text-white"
                                        : ""
                                }
                                style={{ cursor: "pointer" }}
                            >
                                Name{" "}
                                {sortConfig.key === "name" &&
                                    (sortConfig.direction === "asc" ? (
                                        <FaSortUp />
                                    ) : (
                                        <FaSortDown />
                                    ))}
                            </th>
                            <th
                                onClick={() => sortBy("email")}
                                className={
                                    sortConfig.key === "email"
                                        ? "bg-primary text-white"
                                        : ""
                                }
                                style={{ cursor: "pointer" }}
                            >
                                Email{" "}
                                {sortConfig.key === "email" &&
                                    (sortConfig.direction === "asc" ? (
                                        <FaSortUp />
                                    ) : (
                                        <FaSortDown />
                                    ))}
                            </th>
                            <th
                                onClick={() => sortBy("phone")}
                                className={
                                    sortConfig.key === "phone"
                                        ? "bg-primary text-white"
                                        : ""
                                }
                                style={{ cursor: "pointer" }}
                            >
                                Phone{" "}
                                {sortConfig.key === "phone" &&
                                    (sortConfig.direction === "asc" ? (
                                        <FaSortUp />
                                    ) : (
                                        <FaSortDown />
                                    ))}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name ?? "N/A"}</td>
                                <td>{user.email ?? "N/A"}</td>
                                <td>{user.phone ?? "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card View for Mobile */}
            <div className="d-block d-md-none">
                {filteredUsers.map((user) => (
                    <div
                        className="card mb-3 shadow-lg border-0 rounded-3"
                        key={user.id}
                    >
                        <div className="card-header gradient-header text-white">
                            <h5 className="card-title mb-0">
                                {user.name ?? "N/A"}
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                <FaEnvelope className="me-2 text-secondary" />
                                {user.email ?? "N/A"}
                            </p>
                            <p className="card-text">
                                <FaPhone className="me-2 text-secondary" />
                                {user.phone ?? "N/A"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserList;
