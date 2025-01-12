import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Import UserContext
import "../App.css"; // Import styles

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<string | null>(null); // Success message state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();
  const { setEmail: setUserContextEmail } = useUserContext(); // Access setEmail from UserContext

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        email,
        password,
      });


      // Push email to UserContext
      setUserContextEmail(email);

      setSuccess("Registration successful! Redirecting to subscription...");
      setTimeout(() => navigate("/subscription"), 500); // Redirect to subscription page
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-containerl">
      <h1 className="form-titlel">Register</h1>
      {error && <p className="error-messagel">{error}</p>}
      {success && <p className="success-messagel">{success}</p>}
      <form onSubmit={handleRegister} className="forml">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="form-inputl"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="form-inputl"
          required
        />
        <button
          type="submit"
          className="form-buttonl"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
