import api from './api';

export const userService = {
  // GET /users — Ambil semua user (admin only)
  async getUsers() {
    return await api.get('/users');
  },

  // DELETE /users/:id — Hapus user berdasarkan ID (admin only)
  async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  },
};

export default userService;
