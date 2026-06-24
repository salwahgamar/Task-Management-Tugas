import api from './api';

export const taskService = {
  // GET /data (Pencarian & Relasi terintegrasi di backend)
  async getTasks(search = '') {
    return await api.get('/data', { search });
  },

  // GET /data/:id
  async getTaskById(id) {
    return await api.get(`/data/${id}`);
  },

  // POST /data
  async createTask(taskData) {
    return await api.post('/data', taskData);
  },

  // PUT /data/:id
  async updateTask(id, taskData) {
    return await api.put(`/data/${id}`, taskData);
  },

  // DELETE /data/:id
  async deleteTask(id) {
    return await api.delete(`/data/${id}`);
  },

  // GET /stats (Dashboard ringkasan statistik)
  async getStats() {
    return await api.get('/stats');
  }
};

export default taskService;
