import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import "../App.css";

// Define the structure of the API response
interface WatchlistResponseItem {
  video: {
    id: string;
    name: string;
    thumbnailUrl: string;
    description: string;
    videoUrl: string;
  };
}

// Define the structure of the video data for the UI
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

  useEffect(() => {
    const fetchWatchlistVideos = async () => {
      try {
        // Specify the response type as an array of WatchlistResponseItem
        const response = await axios.get<WatchlistResponseItem[]>(
          `${import.meta.env.VITE_API_URL}/watchlists/videos?email=${email}`
        );

        // Map the response data to match the Video interface
        const formattedVideos = response.data.map((item) => ({
          id: item.video.id,
          name: item.video.name,
          thumbnailUrl: item.video.thumbnailUrl,
          description: item.video.description,
          videoUrl: item.video.videoUrl,
        }));

        setWatchlistVideos(formattedVideos);
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
        url: `${import.meta.env.VITE_API_URL}/watchlists`,
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

      <div className="video-gridh">
        {error ? (
          <p className="error-message">{error}</p>
        ) : watchlistVideos.length > 0 ? (
          watchlistVideos.map((video) => (
            <div key={video.id} className="video-cardh">
              <img
                src={video.thumbnailUrl}
                alt={video.name}
                className="video-thumbnailh"
                onClick={() => navigate(`/video/${video.id}`)}
              />
              <div className="video-infoh">
                <p className="video-titleh">{video.name}</p>
                <button
                  className="watchlist-buttonh"
                  onClick={() => handleRemoveFromWatchlist(video.id)}
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
