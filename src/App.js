import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Registration from "./components/Registration";
import About from "./components/About";
import "./firebase";
import UserList from "./components/UserList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/about" element={<About />} />
                <Route path="/users" element={<UserList />} />
            </Routes>
        </Router>
    );
}

export default App;
