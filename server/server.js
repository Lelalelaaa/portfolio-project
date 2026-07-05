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
        if (!process.env.MONGO_URI) {
            console.warn('WARNING: MONGO_URI environment variable is missing!');
            return; // Don't crash, just skip connecting
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Don't crash the server so AWS health checks can still pass
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
// but explicitly disable caching for index.html so the browser always gets the latest JS references
app.use((req, res, next) => {
  // If the request is for a missing static asset (like an old cached JS file), return 404
  // Otherwise the server will send index.html as a JS file and crash the browser!
  if (req.path.startsWith('/assets/') || req.path.match(/\.(js|css|png|jpg|svg)$/)) {
    return res.status(404).send('Not found');
  }
  
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start the server ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));