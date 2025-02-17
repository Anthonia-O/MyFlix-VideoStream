const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 4001;

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

// Create Users Table
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
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

// Register a new user
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const query = "INSERT INTO users (email, password) VALUES (?, ?)";
        const connection = await pool.getConnection();
        await connection.execute(query, [email, password]);
        connection.release();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "Email is already registered" });
        }
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
});

// Log in an existing user
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }


    try {
        const query = "SELECT * FROM users WHERE email = ?";
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(query, [email]);
        connection.release();

        const user = rows[0];
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }


        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "An error occurred during login" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Authentication service running on port ${port}`);
});
