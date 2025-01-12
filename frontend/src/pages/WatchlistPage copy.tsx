import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import "../App.css";

// Define the structure of the video data
interface Video {
  id: string;
  name: string;
  thumbnailUrl: string;
  description: string;
  videoUrl: string;
}

const WatchlistPage: React.FC = () => {
  const [watchlistVideos, setWatchlistVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { email } = useUserContext();
  const navigate = useNavigate();

  // Fetch videos in the user's watchlist
  useEffect(() => {
    const fetchWatchlistVideos = async () => {
        try {
            const response = await axios.get<Video[]>(
                `${import.meta.env.VITE_API_URL}/watchlists/videos?email=${email}`
            );
            console.log("Watchlist videos:", response.data); // Debug the API response
            setWatchlistVideos(response.data);
        } catch (err) {
            console.error("Error fetching watchlist videos:", err);
            setError("Failed to fetch your watchlist. Please try again.");
        }
    };

    fetchWatchlistVideos();
}, [email]);

  const handleRemoveFromWatchlist = async (videoId: string) => {
    try {
      await axios.request({
        url: `${import.meta.env.VITE_API_URL}/watchlist`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: { email, video_id: videoId },
      });
      setWatchlistVideos((prev) =>
        prev.filter((video) => video.id !== videoId)
      );
      alert("Video removed from your watchlist!");
    } catch (err) {
      console.error("Error removing video from watchlist:", err);
      alert("Failed to remove video from your watchlist.");
    }
  };

  const handleSignOut = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* Header Section */}
      <header className="headerh">
        <h1 className="header-titleh">MyFlix</h1>
        <div className="header-actionsh">
          <button onClick={() => navigate("/home")} className="header-buttonh">
            Home
          </button>
          <button onClick={() => navigate("/watchlist")} className="header-buttonh">
            Watchlist
          </button>
          <button onClick={handleSignOut} className="header-buttonh">
            Logout
          </button>
        </div>
      </header>

      {/* Watchlist Videos Section */}
      <div className="video-gridh">
        {error ? (
          <p className="error-messageh">{error}</p>
        ) : watchlistVideos.length > 0 ? (
          watchlistVideos.map((video) => (
            <div key={video.id} className="video-cardh">
              <img
                src={video.thumbnailUrl}
                alt={video.name}
                className="video-thumbnailh"
                onClick={() => navigate(`/video/${video.id}`)} // Navigate to VideoPage
              />
              <div className="video-infoh">
                <p className="video-titleh">{video.name}</p>
                <button
                  className="remove-watchlist-buttonh"
                  onClick={() => handleRemoveFromWatchlist(video.id)} // Remove from Watchlist
                >
                  Remove from Watchlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-videosh">Your watchlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
