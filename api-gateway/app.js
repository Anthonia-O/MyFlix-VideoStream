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

app.put('/profile', async (req, res) => {
    try {
        const response = await axios.put(`${services.auth}/profile`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /profile:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

app.get('/profile', async (req, res) => {
    try {
        const response = await axios.get(`${services.auth}/profile`, { params: req.query });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /profile:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

// Billing Service Handlers
app.post('/billing/create-subscription', async (req, res) => {
    try {
        const response = await axios.post(`${services.billing}/create-subscription`, req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /billing/create-subscription:', err.message);
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

// Watchlist Service Handlers
app.post('/watchlist/add', async (req, res) => {
    try {
        const response = await axios.post(`${services.watchlist}/watchlist/add`, req.body); // Forward to /watchlist/add
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /watchlist/add:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

app.get('/watchlist', async (req, res) => {
    try {
        const response = await axios.get(`${services.watchlist}/watchlist`, { params: req.query }); // Forward to /watchlist
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error('Error in /watchlist:', err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Server Error' });
    }
});

// Start the API Gateway server
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
