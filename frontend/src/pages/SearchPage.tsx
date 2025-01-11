import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Include CSS for styling

// Define the type for the video data
interface Video {
  id: string;
  name: string;
  thumbnailUrl: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for the search bar input
  const [videos, setVideos] = useState<Video[]>([]); // State for the list of videos
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();

  // Fetch videos matching the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setVideos([]); // Clear the video list if the search query is empty
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get<Video[]>(`${import.meta.env.VITE_API_URL}/video-management/videos/search`, {
        params: { query: searchQuery },
      })
      .then((response) => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch search results. Please try again.");
        setLoading(false);
      });
  }, [searchQuery]); // Run the effect whenever the search query changes

  return (
    <div className="search-page">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Search for Videos</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/home")} className="header-button">
            Home
          </button>
          <button onClick={() => navigate("/profile")} className="header-button">
            Profile
          </button>
          <button onClick={() => navigate("/watchlist")} className="header-button">
            Watchlist
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

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Type a video name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Search Results */}
      <div className="video-list">
        {loading && <p>Loading search results...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && videos.length === 0 && searchQuery.trim() !== "" && (
          <p>No results found for "{searchQuery}".</p>
        )}
        {!loading &&
          !error &&
          videos.map((video) => (
            <div key={video.id} className="video-thumbnail">
              <img
                src={video.thumbnailUrl}
                alt={video.name}
                onClick={() => navigate(`/video/${video.id}`)} // Navigate to the VideoPage
                className="thumbnail-image"
              />
              <h3 className="video-title">{video.name}</h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
