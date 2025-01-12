// Install required packages:
// npm install express stripe body-parser dotenv cors

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend integration
app.use(bodyParser.json()); // Parse JSON request bodies

// Test root endpoint
app.get('/', (req, res) => {
    res.send('Stripe Payment Gateway API is running!');
});

// Endpoint to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body; // Receive amount and currency from the client

        if (!amount || !currency) {
            return res.status(400).json({ error: 'Amount and currency are required' });
        }

        console.log(`Received request for payment intent: Amount: ${amount}, Currency: ${currency}`);

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in the smallest currency unit (e.g., cents for USD)
            currency, // Currency code (e.g., 'usd')
            payment_method_types: ['card'], // Ensure card payments are supported
        });

        // Respond with the client secret for the frontend to use
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
