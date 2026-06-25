const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const db = require('../config/db');

const userModel = new UserModel(db);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyfortaskmanager123';

class AuthController {
  // Register user
  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // --- Validasi Backend (Mandatory) ---
      if (!username || username.trim().length < 3) {
        return res.status(400).json({ message: 'Username wajib diisi dan minimal 3 karakter.' });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email tidak valid.' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password wajib diisi dan minimal 6 karakter.' });
      }

      // Check username / email availability
      const existingUserByName = await userModel.findByUsername(username);
      if (existingUserByName) {
        return res.status(409).json({ message: 'Username sudah terdaftar.' });
      }

      const existingUserByEmail = await userModel.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: 'Email sudah terdaftar.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user
      const newUser = await userModel.create({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'user' // Registrasi hanya diperbolehkan untuk peran standard 'user'
      });

      return res.status(201).json({
        message: 'Registrasi berhasil! Silakan login.',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat registrasi.' });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // --- Validasi Backend ---
      if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username atau email wajib diisi.' });
      }

      if (!password || password === '') {
        return res.status(400).json({ message: 'Password wajib diisi.' });
      }

      // Find user (by username OR email)
      let user = await userModel.findByUsername(username);
      if (!user) {
        user = await userModel.findByEmail(username);
      }

      if (!user) {
        return res.status(401).json({ message: 'Kredensial tidak valid: User tidak ditemukan.' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Kredensial tidak valid: Password salah.' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' } // Token expires in 1 day
      );

      return res.status(200).json({
        message: 'Login berhasil!',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat login.' });
    }
  }

  // Logout user
  static async logout(req, res) {
    // JWT is stateless. Clients should discard the token.
    // We send success message.
    return res.status(200).json({ message: 'Logout berhasil!' });
  }
}

module.exports = AuthController;
