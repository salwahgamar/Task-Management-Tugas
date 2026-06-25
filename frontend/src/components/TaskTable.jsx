import React from 'react';
import { Edit, Trash2, Calendar, User as UserIcon, Pin, Check, RotateCcw } from 'lucide-react';
import { formatDate, formatStatus } from '../utils/formatters';

const TaskTable = ({ tasks, onEdit, onDelete, currentUser, onToggleComplete }) => {
  const isAdmin = currentUser?.role === 'admin';

  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass rounded-2xl border border-slate-800/80 p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-500 mb-4">
          📋
        </div>
        <p className="text-slate-400 font-medium">Belum ada tugas ditemukan.</p>
        <p className="text-sm text-slate-500 mt-1">Coba cari kata kunci lain atau tambahkan tugas baru.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Tugas</th>
              <th className="px-6 py-4 hidden md:table-cell">Deskripsi</th>
              <th className="px-6 py-4">Jatuh Tempo</th>
              {isAdmin && <th className="px-6 py-4">Pembuat</th>}
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {tasks.map((task) => {
              const statusStyle = formatStatus(task.status);
              
              // Only owners or admins can perform edit/delete
              const canModify = isAdmin || task.user_id === currentUser?.id;
              const isPriority = task.is_priority === 1 || task.is_priority === true;

              return (
                <tr 
                  key={task.id} 
                  className={`transition-colors ${
                    isPriority 
                      ? 'bg-amber-500/5 hover:bg-amber-500/10' 
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  {/* Title */}
                  <td className="px-6 py-4 font-semibold text-slate-100">
                    <div className="flex items-center gap-2">
                      {isPriority && (
                        <span 
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                          title="Tugas Prioritas"
                        >
                          <Pin size={10} className="fill-amber-600 dark:fill-amber-400" /> Prioritas
                        </span>
                      )}
                      <div className="max-w-[180px] sm:max-w-[240px] truncate">
                        {task.title}
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                    <div className="max-w-[300px] truncate">
                      {task.description || '-'}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-500" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                  </td>

                  {/* Owner (Relasi Data) */}
                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <UserIcon size={14} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-medium text-indigo-700 dark:text-indigo-300">{task.owner}</span>
                      </div>
                    </td>
                  )}

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.color}`}>
                      {statusStyle.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {canModify ? (
                        <>
                          {onToggleComplete && (
                            <button
                              onClick={() => onToggleComplete(task)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                task.status === 'completed'
                                  ? 'text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-800/50'
                                  : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-800/50'
                              }`}
                              title={task.status === 'completed' ? 'Pulihkan Tugas (Menjadi Tertunda)' : 'Tandai Selesai'}
                            >
                              {task.status === 'completed' ? <RotateCcw size={16} /> : <Check size={16} />}
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(task)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-800/50 transition-colors"
                            title="Edit Tugas"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-800/50 transition-colors"
                            title="Hapus Tugas"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-550 italic">Hanya Baca</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
