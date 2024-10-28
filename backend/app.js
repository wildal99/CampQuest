const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Use CORS middleware
app.use(cors({
  origin: '*', // or '*' to allow all origins
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Define routes
const campRouter = require('./routes/campgrounds');
app.use('/camps', campRouter);

module.exports = app;