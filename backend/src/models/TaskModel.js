class TaskModel {
  constructor(dbPool) {
    this.db = dbPool;
  }

  // Find all tasks with optional search query and role-based filtering
  async findAll({ userId, role, search = '' }) {
    let query = `
      SELECT t.*, u.username as owner 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    // Authorization: User can only see their own tasks. Admin sees all.
    if (role !== 'admin') {
      conditions.push('t.user_id = ?');
      params.push(userId);
    }

    // Search Query: Wajib "Query pencarian"
    if (search.trim() !== '') {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Sort by due_date
    query += ' ORDER BY t.due_date ASC, t.created_at DESC';

    const [rows] = await this.db.execute(query, params);
    return rows;
  }

  // Find single task by ID with authorization check
  async findById(id, { userId, role }) {
    let query = `
      SELECT t.*, u.username as owner 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.id = ?
    `;
    const params = [id];

    if (role !== 'admin') {
      query += ' AND t.user_id = ?';
      params.push(userId);
    }

    const [rows] = await this.db.execute(query, params);
    return rows.length > 0 ? rows[0] : null;
  }

  // Create a new task
  async create({ title, description, status = 'pending', due_date, user_id }) {
    const query = `
      INSERT INTO tasks (title, description, status, due_date, user_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await this.db.execute(query, [title, description, status, due_date, user_id]);
    return { id: result.insertId, title, description, status, due_date, user_id };
  }

  // Update an existing task
  async update(id, { userId, role }, { title, description, status, due_date }) {
    // First, verify access
    const task = await this.findById(id, { userId, role });
    if (!task) return null;

    const query = `
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, due_date = ? 
      WHERE id = ?
    `;
    await this.db.execute(query, [title, description, status, due_date, id]);
    return { id, title, description, status, due_date, user_id: task.user_id };
  }

  // Delete a task
  async delete(id, { userId, role }) {
    // First, verify access
    const task = await this.findById(id, { userId, role });
    if (!task) return false;

    const query = 'DELETE FROM tasks WHERE id = ?';
    await this.db.execute(query, [id]);
    return true;
  }

  // Get statistics for Dashboard (Wajib: Total data & Statistik ringkas)
  async getDashboardStats({ userId, role }) {
    let queryTasks = 'SELECT status, COUNT(*) as count FROM tasks';
    let queryTotal = 'SELECT COUNT(*) as total FROM tasks';
    const params = [];

    if (role !== 'admin') {
      queryTasks += ' WHERE user_id = ?';
      queryTotal += ' WHERE user_id = ?';
      params.push(userId);
    }

    queryTasks += ' GROUP BY status';

    const [tasksRows] = await this.db.execute(queryTasks, params);
    const [totalRows] = await this.db.execute(queryTotal, params);

    // Initial structure
    const stats = {
      total: totalRows[0]?.total || 0,
      pending: 0,
      in_progress: 0,
      completed: 0
    };

    // Populate stats from database rows
    tasksRows.forEach(row => {
      if (row.status === 'pending') stats.pending = row.count;
      else if (row.status === 'in_progress') stats.in_progress = row.count;
      else if (row.status === 'completed') stats.completed = row.count;
    });

    // If admin, we also get user statistics
    if (role === 'admin') {
      const [usersRows] = await this.db.execute('SELECT COUNT(*) as count FROM users');
      stats.totalUsers = usersRows[0]?.count || 0;
    }

    return stats;
  }
}

module.exports = TaskModel;
