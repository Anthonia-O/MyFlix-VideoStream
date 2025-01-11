import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import styles

// Define the structure of the video data
interface RawVideoData {
  _id: { $oid: string };
  video: {
    id: string;
    name: string;
    thumbnailUrl: string;
    description: string;
    videoUrl: string;
  };
}

interface Video {
  id: string;
  name: string;
  thumbnailUrl: string;
}

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]); // Ensure videos is always an array
  const navigate = useNavigate();

  // Fetch videos from the video management database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get<RawVideoData[]>(
          `${import.meta.env.VITE_API_URL}/videos`
        );

        // Transform raw data to extract required video details
        const formattedVideos = response.data.map((videoData) => {
          const videoInfo = videoData.video || {}; // Extract the 'video' object
          return {
            id: videoInfo.id || "",
            name: videoInfo.name || "",
            thumbnailUrl: videoInfo.thumbnailUrl || "",
          };
        });

        setVideos(formattedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Handle adding a video to the watchlist
  const handleAddToWatchlist = async (videoId: string) => {
    const userId = localStorage.getItem("user_id"); // Retrieve user ID from localStorage
    if (!userId) {
      alert("You need to be logged in to add videos to the watchlist.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/watchlist/add`, {
        user_id: userId,
        video_id: videoId,
      });
      alert("Video added to your watchlist!");
      navigate("/watchlist");
    } catch (error) {
      console.error("Error adding video to watchlist:", error);
      alert("Failed to add video to your watchlist.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
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
          <button onClick={() => navigate("/profile")} className="header-buttonh">
            Profile
          </button>
          <button onClick={() => navigate("/watchlist")} className="header-buttonh">
            Watchlist
          </button>
          <button onClick={() => navigate("/search")} className="header-buttonh">
            Search
          </button>
          <button onClick={handleSignOut} className="header-buttonh">
            Logout
          </button>
        </div>
      </header>

      {/* Video Thumbnails */}
      <div className="video-gridh">
        {videos.length > 0 ? (
          videos.map((video) => (
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
                  className="watchlist-buttonh"
                  onClick={() => handleAddToWatchlist(video.id)} // Add to Watchlist
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-videosh">No videos available</p> // Fallback for empty data
        )}
      </div>
    </div>
  );
};

export default HomePage;
