import api from './api';

export const authService = {
  async register(username, email, password, role = 'user') {
    return await api.post('/register', { username, email, password, role });
  },

  async login(username, password) {
    const data = await api.post('/login', { username, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Logout API call failed, removing local credentials anyway.', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
export default authService;
