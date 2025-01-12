const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.VIDEO_SERVICE_PORT || 4003;
const RESTHEART_URL = process.env.RESTHEART_URL;

app.use(express.json());

// Fetch all videos with pagination
app.get("/videos", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const response = await axios.get(
      `${RESTHEART_URL}?skip=${skip}&limit=${limit}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching all videos:", error.message);
    res.status(500).json({
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
});

// Fetch a video by ID
app.get("/videos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${RESTHEART_URL}/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching video by ID:", error.message);
    res.status(404).json({
      message: "Video not found",
      error: error.message,
    });
  }
});

// Create a new video
app.post("/videos", async (req, res) => {
  const { name, thumbnailUrl, description, videoUrl } = req.body;

  if (!name || !thumbnailUrl || !description || !videoUrl) {
    return res.status(400).json({
      message: "All fields (name, thumbnailUrl, description, videoUrl) are required",
    });
  }

  try {
    const response = await axios.post(RESTHEART_URL, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error creating video:", error.message);
    res.status(500).json({
      message: "Failed to create video",
      error: error.message,
    });
  }
});

// Update a video by ID
app.put("/videos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.put(`${RESTHEART_URL}/${id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error updating video:", error.message);
    res.status(500).json({
      message: "Failed to update video",
      error: error.message,
    });
  }
});

// Delete a video by ID
app.delete("/videos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await axios.delete(`${RESTHEART_URL}/${id}`);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting video:", error.message);
    res.status(500).json({
      message: "Failed to delete video",
      error: error.message,
    });
  }
});

// Search videos by name
app.get("/videos/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      message: "Search query is required",
    });
  }

  try {
    const filter = {
      name: {
        $regex: query,
        $options: "i", // Case-insensitive search
      },
    };

    const response = await axios.get(
      `${RESTHEART_URL}?filter=${encodeURIComponent(JSON.stringify(filter))}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error searching videos:", error.message);
    res.status(500).json({
      message: "Failed to search videos",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Video management service running on port ${port}`);
});
