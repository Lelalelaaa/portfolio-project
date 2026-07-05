// server.js
// This is the main backend file. It starts the server, connects to
// the MongoDB database, and sets up all the API routes.
//
// To run it: npm start (or node server.js)
// It listens on port 5000 by default.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load settings from the .env file

const app = express();

// --- Middleware ---

// Allow the React frontend to communicate with this server
app.use(cors());

// Allow the server to read JSON data sent from the frontend
app.use(express.json());

// --- Connect to MongoDB ---

const connectDB = async () => {
  try {
    // Make sure MONGO_URI is set in the .env file before connecting
    if (!process.env.MONGO_URI) {
      console.warn('WARNING: MONGO_URI is not set in the .env file.');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Could not connect to database:', err.message);
    process.exit(1); // Stop the server if the database fails to connect
  }
};

connectDB();

// --- API Routes ---

// Routes for managing projects (CRUD)
app.use('/api/projects', require('./routes/projects'));

// Routes for contact form messages
app.use('/api/messages', require('./routes/messages'));

// Simple check to confirm the server is running (moved to /api)
app.get('/api', (req, res) => res.send('API Running'));

// --- Serve React Frontend ---
// Serve static files from the 'public' folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// For any other route, send the React index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start the server ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));