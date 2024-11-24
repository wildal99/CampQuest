const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*', // or '*' to allow all origins
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(express.json());

const campRouter = require('./routes/campgrounds');
app.use('/camps', campRouter);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

module.exports = app;