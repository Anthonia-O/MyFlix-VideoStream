const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.WATCHLIST_SERVICE_PORT || 4005;
const RESTHEART_URL = process.env.RESTHEART_URL; // Example: "http://restheart:8080/watchlists"
const VIDEO_SERVICE_URL = process.env.VIDEO_SERVICE_URL;

app.use(express.json());

/// Add video to the watchlist
app.post("/watchlists/add", async (req, res) => {
    const { watchlist } = req.body;

    if (!watchlist || !watchlist.email || !watchlist.video_id) {
        return res.status(400).json({
            message: "Email and video_id are required in the watchlist object.",
        });
    }

    try {
        const response = await axios.post(RESTHEART_URL, { watchlist });
        res.status(201).json({
            message: "Video added to the watchlist successfully.",
            data: response.data,
        });
    } catch (error) {
        console.error("Error adding video to watchlist:", error.message);
        res.status(500).json({
            message: "Failed to add video to the watchlist.",
            error: error.response?.data || error.message,
        });
    }
});

// Get videos in the user's watchlist
app.get("/watchlists/videos", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({
            message: "Email is required.",
        });
    }

    try {
        // Fetch watchlist items for the user
        const watchlistResponse = await axios.get(
            `${RESTHEART_URL}?filter=${encodeURIComponent(
                JSON.stringify({ "watchlist.email": email })
            )}`
        );

        const watchlistVideoIds = watchlistResponse.data.map(
            (item) => item.watchlist.video_id
        );

        if (watchlistVideoIds.length === 0) {
            return res.status(200).json([]); // Empty watchlist
        }

        // Fetch all videos
        const videosResponse = await axios.get(VIDEO_SERVICE_URL);
        const allVideos = videosResponse.data;

        // Match watchlist video IDs with the video data
        const filteredVideos = allVideos.filter((video) =>
            watchlistVideoIds.includes(video.video.id)
        );

        res.status(200).json(filteredVideos);
    } catch (error) {
        console.error("Error fetching watchlist videos:", error.message);
        res.status(500).json({
            message: "Failed to fetch watchlist videos.",
            error: error.response?.data || error.message,
        });
    }
});

// Remove video from the watchlist
app.delete("/watchlists", async (req, res) => {
    const { email, video_id } = req.body;

    if (!email || !video_id) {
        return res.status(400).json({ message: "Email and video_id are required." });
    }

    try {
        const filter = {
            "watchlist.email": email,
            "watchlist.video_id": video_id,
        };

        const response = await axios.delete(
            `${RESTHEART_URL}?filter=${encodeURIComponent(JSON.stringify(filter))}`
        );

        res.status(200).json({ message: "Video removed from the watchlist." });
    } catch (error) {
        console.error("Error removing video from watchlist:", error.message);
        res.status(500).json({
            message: "Failed to remove video from the watchlist.",
            error: error.response?.data || error.message,
        });
    }
});


// Start the Watchlist service server
app.listen(port, () => {
    console.log(`Watchlist service running on port ${port}`);
});
