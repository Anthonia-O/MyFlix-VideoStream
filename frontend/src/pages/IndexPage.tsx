import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Import global styles

const IndexPage: React.FC = () => {
  return (
    <div className="containeri">
      {/* Header Section */}
      <header className="headeri">
        <h1 className="titlei">Welcome to MyFlix 2.0</h1>
        <p className="descriptioni">
          Discover a world of movies, series, and documentaries tailored to your
          preferences. Your gateway to unlimited entertainment awaits!
        </p>
      </header>

      {/* Buttons Section */}
      <div className="button-containeri">
        <Link to="/register">
          <button
            className="button register-button"
            aria-label="Register for MyFlix"
          >
            Register
          </button>
        </Link>
        <Link to="/login">
          <button
            className="button login-button"
            aria-label="Log in to MyFlix"
          >
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
