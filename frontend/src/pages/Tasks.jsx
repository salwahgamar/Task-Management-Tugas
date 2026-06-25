import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import taskService from '../services/task';
import TaskTable from '../components/TaskTable';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const { user } = useAuth();
  
  // State variables
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch all tasks (can filter with searchQuery)
  const fetchTasks = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      // Async/Await & Fetch/Axios via taskService
      const fetchedTasks = await taskService.getTasks(search);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar tugas.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Search Input (Event Handling & Array Filter/Query)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchTasks('');
  };

  // Open Form Modal for Create
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  // Open Form Modal for Edit
  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  // Handle Submit Form (Create / Update CRUD actions)
  const handleFormSubmit = async (formData) => {
    setIsFormOpen(false);
    setLoading(true);
    setSuccessMsg('');
    setError('');

    try {
      if (selectedTask) {
        // Update Action
        const res = await taskService.updateTask(selectedTask.id, formData);
        setSuccessMsg(res.message || 'Tugas berhasil diperbarui.');
      } else {
        // Create Action
        const res = await taskService.createTask(formData);
        setSuccessMsg(res.message || 'Tugas berhasil dibuat.');
      }
      fetchTasks(searchQuery);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data tugas.');
      setLoading(false);
    }
  };

  // Handle Delete CRUD action
  const handleDeleteTask = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak bisa dibatalkan.')) {
      setLoading(true);
      setSuccessMsg('');
      setError('');
      try {
        const res = await taskService.deleteTask(id);
        setSuccessMsg(res.message || 'Tugas berhasil dihapus.');
        fetchTasks(searchQuery);
      } catch (err) {
        setError(err.message || 'Gagal menghapus tugas.');
        setLoading(false);
      }
    }
  };

  // Handle complete / incomplete status toggle
  const handleToggleComplete = async (task) => {
    setLoading(true);
    setSuccessMsg('');
    setError('');
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const res = await taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        due_date: task.due_date
      });
      setSuccessMsg(newStatus === 'completed' ? 'Tugas ditandai sebagai selesai!' : 'Tugas dipulihkan.');
      fetchTasks(searchQuery);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui status tugas.');
      setLoading(false);
    }
  };

  // Flash Message auto-timeout
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Kelola Tugas</h2>
          <p className="text-sm text-slate-400">
            {user?.role === 'admin' 
              ? 'Daftar semua tugas yang ada di sistem database.' 
              : 'Daftar tugas pribadi Anda.'}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Tambah Tugas</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-xl animate-fade-in">
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-md relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
            className="w-full bg-slate-900 border border-slate-800/80 rounded-xl pl-10 pr-10 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
          />
          <Search size={16} className="absolute left-3.5 text-slate-500" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <button
          onClick={() => fetchTasks(searchQuery)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-450 hover:text-white hover:bg-slate-900 transition-all text-sm font-medium self-end sm:self-center"
          title="Refresh Data"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Segarkan</span>
        </button>
      </div>

      {/* Table list */}
      {loading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <TaskTable
          tasks={tasks.filter(t => t.status !== 'completed')}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          currentUser={user}
        />
      )}

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <TaskForm
          initialData={selectedTask}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          titleText={selectedTask ? 'Perbarui Data Tugas' : 'Tambah Tugas Baru'}
        />
      )}
    </div>
  );
};

export default Tasks;
