const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS

const app = express();
const port = 5000;

const services = {
    auth: 'http://authentication:4001',
    billing: 'http://billing:4002',
    videoManagement: 'http://video-management:4003',
    watchlist: 'http://watchlist:4005',
};

app.use(express.json());
app.use(cors());


// Authentication Service Handlers
app.post('/auth/register', async (req, res) => {
    try {
        const response = await axios.post(`${services.auth}/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /auth/register:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const response = await axios.post(`${services.auth}/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /auth/login:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

// Billing Service Handlers
app.post('/create-payment-intent', async (req, res) => {
    try {
        const response = await axios.post(`${services.billing}/create-payment-intent`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /create-payment-intent:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

// Video Management Service Handlers
app.get('/videos', async (req, res) => {
    try {
        const response = await axios.get(`${services.videoManagement}/videos`);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /videos:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

app.get('/videos/:id', async (req, res) => {
    try {
        const response = await axios.get(`${services.videoManagement}/videos/${req.params.id}`);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /videos/:id:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

app.get('/videos/search', async (req, res) => {
    try {
        const response = await axios.get(`${services.videoManagement}/videos/search`, { params: req.query });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /videos/search:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});


// Add video to the watchlist
app.post("/watchlists/add", async (req, res) => {
    try {
        const response = await axios.post(`${services.watchlist}/watchlists/add`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Error in /watchlists/add:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Failed to add video to the watchlist.",
            error: error.response?.data || error.message,
        });
    }
});

// Get videos in the user's watchlist
app.get("/watchlists/videos", async (req, res) => {
    try {
        const response = await axios.get(`${services.watchlist}/watchlists/videos`, {
            params: req.query,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Error in /watchlists/videos:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Failed to fetch watchlist videos.",
            error: error.response?.data || error.message,
        });
    }
});

// Remove video from the watchlist
app.delete("/watchlists", async (req, res) => {
    try {
        const response = await axios.delete(`${services.watchlist}/watchlists`, {
            data: req.body,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Error in /watchlists:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Failed to remove video from the watchlist.",
            error: error.response?.data || error.message,
        });
    }
});


// Start the API Gateway server
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
