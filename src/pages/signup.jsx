
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/signup", {
        email,
        password,
      });

      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={signup}>Create Account</button>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>

        <p>
          <Link to="/chat" className="auth-link">
            Continue as Guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
