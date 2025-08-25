import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container mt-5">
            <h1>Welcome to InfoHub</h1>
            <p>Manage your data efficiently using our mobile app.</p>
            <Link to="/registration" className="btn btn-primary">
                Register
            </Link>
        </div>
    );
}

export default Home;
