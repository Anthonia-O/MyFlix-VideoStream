import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Video.css"; // Import styles

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
  description: string;
  videoUrl: string;
}

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the video ID from the URL
  const [video, setVideo] = useState<Video | null>(null); // State to store video details
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch the specific video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get<RawVideoData[]>(
          `${import.meta.env.VITE_API_URL}/videos`
        );

        // Find the video with the matching ID
        const rawVideos = response.data;
        const videoData = rawVideos.find((item) => item.video.id === id)?.video;

        if (!videoData) {
          setError("Video not found");
          return;
        }

        // Map the response to match the Video interface
        setVideo({
          id: videoData.id,
          name: videoData.name,
          thumbnailUrl: videoData.thumbnailUrl,
          description: videoData.description,
          videoUrl: videoData.videoUrl,
        });
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("An error occurred while fetching video details.");
      }
    };

    fetchVideo();
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>; // Display error message
  }

  if (!video) {
    return <p className="loading-message">Loading video...</p>; // Loading state
  }

  return (
    <div className="video-page">
      {/* Video Title */}
      <h1 className="video-title">{video.name}</h1>

      {/* Video Player */}
      <video controls className="video-player">
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Description */}
      <p className="video-description">{video.description}</p>
    </div>
  );
};

export default VideoPage;
