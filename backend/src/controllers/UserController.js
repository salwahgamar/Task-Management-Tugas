const UserModel = require('../models/UserModel');
const db = require('../config/db');

const userModel = new UserModel(db);

class UserController {
  // GET /users — Get all users (admin only)
  static async getUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      return res.status(200).json({ users, total: users.length });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
    }
  }

  // DELETE /users/:id — Delete a user by ID (admin only)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Admin tidak dapat menghapus akun sendiri.' });
      }

      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
      }

      const deleted = await userModel.deleteById(id);
      if (!deleted) {
        return res.status(500).json({ message: 'Gagal menghapus pengguna.' });
      }

      return res.status(200).json({ message: `Pengguna '${user.username}' berhasil dihapus.` });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
  }
}

module.exports = UserController;
