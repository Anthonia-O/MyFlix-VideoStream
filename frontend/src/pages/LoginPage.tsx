import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../App.css";

const LoginPage: React.FC = () => {
  const { setEmail } = useUserContext();
  const [localEmail, setLocalEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: localEmail,
        password,
      });
      setEmail(localEmail);
      console.log("Login successful");
      navigate("/home");
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid credentials");
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="form-containerl">
      <h1 className="form-titlel">Log In</h1>
      {error && <p className="error-messagel">{error}</p>}
      <form onSubmit={handleLogin} className="forml">
        <input
          type="email"
          placeholder="Email"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          className="form-inputl"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-inputl"
          required
        />
        <button
          type="submit"
          className="form-buttonl"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
