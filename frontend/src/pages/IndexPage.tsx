import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Import global styles

const IndexPage: React.FC = () => {
  return (
    <div className="containeri">
      {/* Header Section */}
      <header className="headeri">
        <h1 className="titlei">Welcome to MyFlix</h1>
        <p className="descriptioni">
          Discover a world of movies, series, and documentaries tailored to your
          preferences. Your gateway to unlimited entertainment awaits!
        </p>
      </header>

      {/* Buttons Section */}
      <div className="button-containeri">
        <Link to="/register">
          <button
            className="button register-buttoni"
            aria-label="Register for MyFlix"
          >
            Register
          </button>
        </Link>
        <Link to="/login">
          <button
            className="button login-buttoni"
            aria-label="Log in to MyFlix"
          >
            Log In
          </button>
        </Link>
      </div>

      {/* Footer Section */}
      <footer className="footeri">
        <p>
          New to MyFlix? <Link to="/register">Create an account</Link> and start
          exploring today!
        </p>
        <p>
          Already have an account? <Link to="/login">Log in</Link> to continue
          watching.
        </p>
      </footer>
    </div>
  );
};

export default IndexPage;
