class UserModel {
  constructor(dbPool) {
    this.db = dbPool;
  }

  // Create a new user
  async create({ username, email, password, role = 'user' }) {
    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await this.db.execute(query, [username, email, password, role]);
    return { id: result.insertId, username, email, role };
  }

  // Find user by username
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await this.db.execute(query, [username]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await this.db.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Find user by ID
  async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
    const [rows] = await this.db.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Get all users (admin only)
  async getAllUsers() {
    const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
    const [rows] = await this.db.execute(query);
    return rows;
  }

  // Delete user by ID (admin only)
  async deleteById(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await this.db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Seed default admin and user if users table is empty
  async seedDefaultUsers(bcrypt) {
    try {
      const [rows] = await this.db.execute('SELECT COUNT(*) as count FROM users');
      if (rows[0].count === 0) {
        console.log('No users found in database. Seeding default admin and user...');
        
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);

        await this.create({
          username: 'admin',
          email: 'admin@taskmanager.com',
          password: adminPassword,
          role: 'admin'
        });

        await this.create({
          username: 'user',
          email: 'user@taskmanager.com',
          password: userPassword,
          role: 'user'
        });

        console.log('Seeding completed:');
        console.log('- Admin: admin / admin123');
        console.log('- User: user / user123');
      }
    } catch (err) {
      console.error('Failed to seed default users:', err.message);
    }
  }
}

module.exports = UserModel;
