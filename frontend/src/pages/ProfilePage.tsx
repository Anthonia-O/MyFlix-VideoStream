import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface UserProfile {
  id: string;
  email: string;
  password: string; // Assuming hashed password is returned for display
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  // Fetch user profile on load
  useEffect(() => {
    axios
      .get<UserProfile>(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setProfile(response.data);
        setEmail(response.data.email);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch profile. Please log in again.");
        setLoading(false);
        navigate("/login");
      });
  }, [navigate]);

  // Handle saving updates to the profile
  const handleSave = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    axios
      .put<UserProfile>(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setProfile(response.data);
        setSuccess("Profile updated successfully!");
        setEditMode(false);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to update profile. Please try again.");
        setLoading(false);
      });
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="profile-container">
        {editMode ? (
          <>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </label>
            <button onClick={handleSave} className="form-button">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="form-button cancel-button">
              Cancel
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>Email:</strong> {profile?.email}
            </p>
            <p>
              <strong>Password:</strong> {profile?.password} {/* Assuming hashed password */}
            </p>
            <button onClick={() => setEditMode(true)} className="form-button">
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
