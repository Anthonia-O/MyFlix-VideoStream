const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const port = process.env.BILLING_SERVICE_PORT || 4002;

// Middleware
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

// Create Tables
const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        stripe_subscription_id VARCHAR(255) NOT NULL UNIQUE,
        customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        price_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log("Database tables created successfully!");
    } catch (error) {
        console.error("Error creating tables:", error.message);
    }
};
createTables();

// Create a new customer and subscription
app.post("/create-subscription", async (req, res) => {
    const { email, payment_method_id } = req.body;

    if (!email || !payment_method_id) {
        return res.status(400).json({ error: "Email and payment method are required" });
    }

    try {
        const connection = await pool.getConnection();

        // Check if customer already exists
        const [existingCustomers] = await connection.execute(
            "SELECT * FROM customers WHERE email = ?",
            [email]
        );

        let stripeCustomerId;
        if (existingCustomers.length > 0) {
            stripeCustomerId = existingCustomers[0].stripe_customer_id;
        } else {
            // Create a new Stripe customer
            const customer = await stripe.customers.create({
                email,
                payment_method: payment_method_id,
                invoice_settings: {
                    default_payment_method: payment_method_id,
                },
            });

            // Save customer in the database
            await connection.execute(
                "INSERT INTO customers (stripe_customer_id, email) VALUES (?, ?)",
                [customer.id, email]
            );

            stripeCustomerId = customer.id;
        }

        // Create a subscription
        const subscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ price: process.env.STRIPE_PRICE_ID }],
            expand: ["latest_invoice.payment_intent"],
        });

        // Save subscription in the database
        const [customer] = await connection.execute(
            "SELECT id FROM customers WHERE stripe_customer_id = ?",
            [stripeCustomerId]
        );
        const customerId = customer[0].id;

        await connection.execute(
            "INSERT INTO subscriptions (stripe_subscription_id, customer_id, status, price_id) VALUES (?, ?, ?, ?)",
            [
                subscription.id,
                customerId,
                subscription.status,
                subscription.items.data[0].price.id,
            ]
        );

        connection.release();

        res.status(201).json({
            message: "Subscription created successfully",
            subscription,
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Subscription creation failed" });
    }
});

// Get subscription status
app.get("/subscription-status", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const connection = await pool.getConnection();

        // Fetch customer and subscription details
        const [customers] = await connection.execute(
            "SELECT * FROM customers WHERE email = ?",
            [email]
        );

        if (customers.length === 0) {
            connection.release();
            return res.status(404).json({ error: "Customer not found" });
        }

        const customerId = customers[0].id;

        const [subscriptions] = await connection.execute(
            "SELECT * FROM subscriptions WHERE customer_id = ?",
            [customerId]
        );

        connection.release();

        if (subscriptions.length === 0) {
            return res.status(404).json({ error: "Subscription not found" });
        }

        res.json({
            email,
            subscription: subscriptions[0],
        });
    } catch (error) {
        console.error("Error fetching subscription status:", error);
        res.status(500).json({ error: "Failed to fetch subscription status" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Billing service running on port ${port}`);
});
