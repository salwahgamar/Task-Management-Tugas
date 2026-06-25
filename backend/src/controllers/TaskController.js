const TaskModel = require('../models/TaskModel');
const db = require('../config/db');

const taskModel = new TaskModel(db);

class TaskController {
  // GET /data (Get tasks with optional search query)
  static async getTasks(req, res) {
    try {
      const { search } = req.query;
      const userId = req.user.id;
      const role = req.user.role;

      const tasks = await taskModel.findAll({ userId, role, search });
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data tugas.' });
    }
  }

  // GET /data/:id (Get task by ID)
  static async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;

      const task = await taskModel.findById(id, { userId, role });
      if (!task) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan atau Anda tidak memiliki akses.' });
      }

      return res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task details:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil detail tugas.' });
    }
  }

  // POST /data (Create task)
  static async createTask(req, res) {
    try {
      const { title, description, status, due_date, is_priority } = req.body;
      const user_id = req.user.id; // The logged in user is the owner

      // --- Validasi Backend (Mandatory) ---
      if (!title || title.trim().length < 3) {
        return res.status(400).json({ message: 'Judul tugas wajib diisi dan minimal 3 karakter.' });
      }

      if (!due_date || isNaN(Date.parse(due_date))) {
        return res.status(400).json({ message: 'Tanggal jatuh tempo wajib diisi dengan format tanggal yang valid.' });
      }

      const validStatuses = ['pending', 'in_progress', 'completed'];
      const taskStatus = status || 'pending';
      if (!validStatuses.includes(taskStatus)) {
        return res.status(400).json({ message: 'Status tugas tidak valid.' });
      }

      const newTask = await taskModel.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status: taskStatus,
        due_date,
        is_priority: !!is_priority,
        user_id
      });

      return res.status(201).json({
        message: 'Tugas berhasil dibuat!',
        task: newTask
      });
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat membuat tugas.' });
    }
  }

  // PUT /data/:id (Update task)
  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, due_date, is_priority } = req.body;
      const userId = req.user.id;
      const role = req.user.role;

      // --- Validasi Backend ---
      if (!title || title.trim().length < 3) {
        return res.status(400).json({ message: 'Judul tugas wajib diisi dan minimal 3 karakter.' });
      }

      if (!due_date || isNaN(Date.parse(due_date))) {
        return res.status(400).json({ message: 'Tanggal jatuh tempo wajib diisi dengan format tanggal yang valid.' });
      }

      const validStatuses = ['pending', 'in_progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status tugas tidak valid.' });
      }

      const updatedTask = await taskModel.update(
        id,
        { userId, role },
        {
          title: title.trim(),
          description: description ? description.trim() : '',
          status,
          due_date,
          is_priority: !!is_priority
        }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan atau Anda tidak memiliki akses untuk memperbaruinya.' });
      }

      return res.status(200).json({
        message: 'Tugas berhasil diperbarui!',
        task: updatedTask
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat memperbarui tugas.' });
    }
  }

  // DELETE /data/:id (Delete task)
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const role = req.user.role;

      const deleted = await taskModel.delete(id, { userId, role });
      if (!deleted) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan atau Anda tidak memiliki akses untuk menghapusnya.' });
      }

      return res.status(200).json({ message: 'Tugas berhasil dihapus!' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat menghapus tugas.' });
    }
  }

  // GET /stats (Get dashboard statistics)
  static async getStats(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;

      const stats = await taskModel.getDashboardStats({ userId, role });
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data statistik.' });
    }
  }
}

module.exports = TaskController;
