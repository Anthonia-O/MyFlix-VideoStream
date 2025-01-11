const axios = require('axios');

const testApiGateway = async () => {
    try {
        console.log("Registering a user...");
        const registerResponse = await axios.post('http://localhost:5000/auth/register', {
            email: "testuser4@example.com",
            password: "password123"
        });
        console.log("Register Response:", registerResponse.data);

        console.log("Logging in...");
        const loginResponse = await axios.post('http://localhost:5000/auth/login', {
            email: "testuser4@example.com",
            password: "password123"
        });
        console.log("Login Response:", loginResponse.data);

        console.log("Getting all videos...");
        const videosResponse = await axios.get('http://localhost:5000/videos');
        console.log("Videos Response:", videosResponse.data);

        console.log("Adding to watchlist...");
        const watchlistAddResponse = await axios.post('http://localhost:5000/watchlist/add', {
            user_id: "testuser1",
            video_id: "video456"
        });
        console.log("Watchlist Add Response:", watchlistAddResponse.data);

        console.log("Getting watchlist...");
        const watchlistResponse = await axios.get('http://localhost:5000/watchlist', {
            params: { user_id: "testuser1" }
        });
        console.log("Watchlist Response:", watchlistResponse.data);
    } catch (error) {
        console.error("Error:", error.response && error.response.data ? error.response.data : error.message);
    }
};

testApiGateway();
