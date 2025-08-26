import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function Registration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validation
        if (name.trim().length < 3) {
            alert("Name must be at least 3 characters");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            alert("Invalid email format");
            return;
        }
        if (phone.length !== 10 || isNaN(phone)) {
            alert("Phone must be 10 digits and numbers only");
            return;
        }

        setLoading(true);
        setSuccess(false);

        try {
            await addDoc(collection(db, "users"), {
                name,
                email,
                phone,
                timestamp: new Date(),
            });

            // ✅ Success message
            setSuccess(true);

            // ✅ Reset form
            setName("");
            setEmail("");
            setPhone("");
        } catch (err) {
            console.error("Error adding document: ", err);
            alert("❌ Error submitting form");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {/* ✅ Success message */}
            {success && (
                <div className="alert alert-success mt-3" role="alert">
                    Registration successful!
                </div>
            )}
        </div>
    );
}

export default Registration;
