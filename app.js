const express = require('express')
const app = express()
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Hello, this is your bot!');
  });
  
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

const DB_URI = process.env.DB_KEY;

// Set up Mongoose connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event handling for successful connection
db.on('connected', () => {
  console.log(`Connected to MongoDB at SirNotEthan@Cluster0 !`);
});

// Event handling for connection errors
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Event handling for disconnection
db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Gracefully close Mongoose connection on process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

require('./index.js')