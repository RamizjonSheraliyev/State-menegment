import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./auth/register";
import Login from "./auth/login";
import Home from "./components/home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
