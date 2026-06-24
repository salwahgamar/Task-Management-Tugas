const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const UserModel = require('./models/UserModel');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, or adjust for frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Body Parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Seed Database if Empty ---
const userModel = new UserModel(db);
userModel.seedDefaultUsers(bcrypt);

// --- Mounting API Routes ---
app.use('/', apiRoutes);

// --- Base Test Endpoint ---
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Task Manager API is running!' });
});

// --- Global Error Handling Middleware (Mandatory) ---
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal server.';
  
  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
  console.log(`Test API at: http://localhost:${PORT}/ping`);
});

module.exports = app;
