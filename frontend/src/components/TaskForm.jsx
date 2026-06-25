import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validateTask } from '../utils/validation';

const TaskForm = ({ initialData, onSubmit, onCancel, titleText = 'Tambah Tugas Baru' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
    is_priority: false
  });
  const [errors, setErrors] = useState({});

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      // Format due_date to YYYY-MM-DD for HTML input[type=date]
      let dateVal = '';
      if (initialData.due_date) {
        const d = new Date(initialData.due_date);
        dateVal = d.toISOString().split('T')[0];
      }
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        due_date: dateVal,
        is_priority: !!initialData.is_priority
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- Validasi Frontend (Mandatory) ---
    const validation = validateTask(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-tight">{titleText}</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1.5">
              Judul Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukkan judul tugas..."
              className={`w-full bg-slate-900 border ${
                errors.title ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
              } rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
              Deskripsi (Opsional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Detail penjelasan tugas..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1.5">
                Status Tugas
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              >
                <option value="pending">Tertunda</option>
                <option value="in_progress">Sedang Berjalan</option>
                <option value="completed">Selesai</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-slate-300 mb-1.5">
                Jatuh Tempo <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={`w-full bg-slate-900 border ${
                  errors.due_date ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
                } rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
              />
              {errors.due_date && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.due_date}</p>
              )}
            </div>
          </div>

          {/* Priority Option */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/30 border border-slate-800/40 rounded-xl transition-all duration-300 hover:border-slate-850">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="is_priority" className="text-sm font-bold text-white cursor-pointer select-none">
                Tugas Prioritas (Pin)
              </label>
              <span className="text-xs text-slate-500">Tugas akan disematkan di bagian paling atas Kelola Tugas dan Dashboard.</span>
            </div>
            <input
              type="checkbox"
              id="is_priority"
              name="is_priority"
              checked={formData.is_priority}
              onChange={handleChange}
              className="h-5 w-5 rounded-lg border-slate-850 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-slate-950 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all text-sm font-medium"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
