const express = require("express");
const stripe = require("stripe")("sk_test_51QdLx4AlTPXAVB6NRw5yHYcA4VvianxGNydbeOcJRyvFSEGblMbpEFv6NiHDhD4EZ6w7pswUmyxVCzFjAVGQsrZP004RbT9Eyy");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.BILLING_SERVICE_PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


// Create Users Table
const createTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
  `;
    try {
        const connection = await pool.getConnection();
        await connection.query(query);
        connection.release();
        console.log("Users table created or already exists");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
};
createTable();

// Create Payment Intent
// Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
    const { email, amount, currency } = req.body;

    if (!email || !amount || !currency) {
        return res.status(400).json({ error: "Email, amount, and currency are required." });
    }

    try {
        const connection = await pool.getConnection();

        // Check if customer exists in the database
        const [customers] = await connection.execute(
            "SELECT stripe_customer_id FROM customers WHERE email = ?",
            [email]
        );

        let stripeCustomerId;
        if (customers.length === 0) {
            // If customer does not exist, create a new customer in Stripe
            const customer = await stripe.customers.create({ email });

            // Save customer in the database
            await connection.execute(
                "INSERT INTO customers (email, stripe_customer_id) VALUES (?, ?)",
                [email, customer.id]
            );

            stripeCustomerId = customer.id;
        } else {
            // Use the existing customer ID
            stripeCustomerId = customers[0].stripe_customer_id;
        }

        connection.release();

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: stripeCustomerId,
            payment_method_types: ["card"],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error.message);
        res.status(500).json({ error: "Failed to create payment intent." });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Billing service running on port ${port}`);
});
