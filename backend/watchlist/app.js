const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.WATCHLIST_SERVICE_PORT || 4005;

const BASE_URL = process.env.RESTHEART_URL;
const WATCHLIST_URL = `${BASE_URL}/watchlist`;

app.use(express.json());

// Ensure the watchlist collection exists
const ensureWatchlistCollection = async () => {
    try {
        await axios.put(WATCHLIST_URL, { _meta: { type: "collection" } });
        console.log("Watchlist collection created or already exists.");
    } catch (error) {
        console.error("Error ensuring watchlist collection:", error.message);
    }
};
ensureWatchlistCollection();

// Add a video to the user's watchlist
app.post("/watchlist/add", async (req, res) => {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
        return res.status(400).json({
            message: "Both user_id and video_id are required.",
        });
    }

    try {
        // Fetch the user's watchlist
        const response = await axios.get(`${WATCHLIST_URL}/${user_id}`).catch(() => null);

        if (response && response.data) {
            // Check if the video is already in the watchlist
            if (response.data.videos && response.data.videos.includes(video_id)) {
                return res.status(409).json({
                    message: "Video already exists in the watchlist.",
                });
            }

            // Update the existing watchlist
            await axios.patch(`${WATCHLIST_URL}/${user_id}`, {
                $addToSet: { videos: video_id },
            });
        } else {
            // Create a new watchlist
            await axios.put(`${WATCHLIST_URL}/${user_id}`, {
                user_id,
                videos: [video_id],
            });
        }

        res.status(200).json({ message: "Video added to watchlist." });
    } catch (error) {
        console.error("Error adding to watchlist:", error.message);
        res.status(500).json({
            message: "Error adding to watchlist.",
            error: error.message,
        });
    }
});

// Get the user's watchlist with pagination
app.get("/watchlist", async (req, res) => {
    const { user_id, page = 1, limit = 10 } = req.query;

    if (!user_id) {
        return res.status(400).json({
            message: "user_id is required.",
        });
    }

    const skip = (page - 1) * limit;

    try {
        const response = await axios.get(`${WATCHLIST_URL}/${user_id}`);

        if (!response.data || !response.data.videos || response.data.videos.length === 0) {
            return res.status(404).json({ message: "Watchlist is empty." });
        }

        // Apply pagination to the watchlist videos
        const paginatedVideos = response.data.videos.slice(skip, skip + limit);

        res.status(200).json({
            total: response.data.videos.length,
            page: Number(page),
            limit: Number(limit),
            videos: paginatedVideos,
        });
    } catch (error) {
        console.error("Error fetching watchlist:", error.message);
        res.status(500).json({
            message: "Error fetching watchlist.",
            error: error.message,
        });
    }
});

// Remove a video from the watchlist
app.delete("/watchlist/remove", async (req, res) => {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
        return res.status(400).json({
            message: "Both user_id and video_id are required.",
        });
    }

    try {
        // Update the watchlist to remove the video
        await axios.patch(`${WATCHLIST_URL}/${user_id}`, {
            $pull: { videos: video_id },
        });

        res.status(200).json({ message: "Video removed from watchlist." });
    } catch (error) {
        console.error("Error removing video from watchlist:", error.message);
        res.status(500).json({
            message: "Error removing video from watchlist.",
            error: error.message,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Watchlist service running on port ${port}`);
});
