const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyfortaskmanager123';

// Middleware to authenticate user using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak ditemukan' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // { id, username, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Akses ditolak: Token tidak valid atau kadaluwarsa' });
  }
}

// Middleware to authorize specific roles (e.g. Admin)
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Autentikasi diperlukan' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Akses ditolak: Peran '${req.user.role}' tidak memiliki izin untuk aksi ini` 
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole
};
