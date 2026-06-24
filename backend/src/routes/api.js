const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const TaskController = require('../controllers/TaskController');
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// --- Auth Endpoints ---
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// --- Task (Data) Endpoints (Protected by JWT) ---
router.get('/data', authenticateToken, TaskController.getTasks);
router.get('/data/:id', authenticateToken, TaskController.getTaskById);
router.post('/data', authenticateToken, TaskController.createTask);
router.put('/data/:id', authenticateToken, TaskController.updateTask);
router.delete('/data/:id', authenticateToken, TaskController.deleteTask);

// --- Extra Dashboard Statistics Endpoint (Protected) ---
router.get('/stats', authenticateToken, TaskController.getStats);

// --- Admin-Only: User Management Endpoints ---
router.get('/users', authenticateToken, authorizeRole('admin'), UserController.getUsers);
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), UserController.deleteUser);

module.exports = router;
