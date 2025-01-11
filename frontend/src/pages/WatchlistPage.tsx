import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

interface WatchlistVideo {
  id: string;
  name: string;
  thumbnailUrl: string;
}

const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch the user's watchlist on load
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("You must be logged in to view your watchlist.");
      setLoading(false);
      return;
    }

    axios
      .get<{ videos: WatchlistVideo[] }>(
        `${import.meta.env.VITE_API_URL}/watchlist`,
        { params: { user_id: userId } }
      )
      .then((response) => {
        setWatchlist(response.data.videos || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch your watchlist. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading your watchlist...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="watchlist-page">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">MyFlix</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/home")} className="header-button">
            Home
          </button>
          <button onClick={() => navigate("/profile")} className="header-button">
            Profile
          </button>
          <button onClick={() => navigate("/search")} className="header-button">
            Search
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="header-button"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Watchlist Content */}
      <div className="video-grid">
        {watchlist.length > 0 ? (
          watchlist.map((video) => (
            <div key={video.id} className="video-card">
              <img
                src={video.thumbnailUrl}
                alt={video.name}
                className="video-thumbnail"
                onClick={() => navigate(`/video/${video.id}`)} // Navigate to VideoPage
              />
              <p className="video-title">{video.name}</p>
            </div>
          ))
        ) : (
          <p className="no-videos">Your watchlist is empty. Start adding videos now!</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
