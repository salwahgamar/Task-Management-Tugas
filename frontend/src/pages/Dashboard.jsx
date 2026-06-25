import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Plus, 
  ArrowRight, 
  TrendingUp,
  Pin
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import taskService from '../services/task';
import StatCard from '../components/StatCard';
import { formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0, totalUsers: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError('');
      try {
        // Asynchronous calls with error handling
        const fetchedStats = await taskService.getStats();
        setStats(fetchedStats);

        const allTasks = await taskService.getTasks();
        // Sort incomplete tasks: priority tasks first, then by due date
        const sorted = [...allTasks]
          .filter(t => t.status !== 'completed')
          .sort((a, b) => {
            const aPriority = a.is_priority === 1 || a.is_priority === true ? 1 : 0;
            const bPriority = b.is_priority === 1 || b.is_priority === true ? 1 : 0;
            if (aPriority !== bPriority) {
              return bPriority - aPriority;
            }
            return new Date(a.due_date) - new Date(b.due_date);
          })
          .slice(0, 4);
        setRecentTasks(sorted);
      } catch (err) {
        setError(err.message || 'Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const completedPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const inProgressPercent = stats.total > 0 ? Math.round((stats.in_progress / stats.total) * 100) : 0;
  const pendingPercent = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-slate-800/80 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-1 rounded-full">
            Ringkasan Sistem
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Halo, {user?.username}! 👋
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            {user?.role === 'admin' 
              ? 'Anda masuk sebagai Administrator. Anda dapat mengawasi seluruh tugas tim dan statistik performa sistem secara realtime.'
              : 'Anda masuk sebagai Standard User. Anda dapat melacak tugas pribadi Anda, status pengerjaan, dan tenggat waktu.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition-all self-start md:self-center"
        >
          <Plus size={16} />
          <span>Kelola Tugas</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tugas"
          value={stats.total}
          icon={TrendingUp}
          color={{ bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-500/20' }}
        />
        <StatCard
          title="Tugas Tertunda"
          value={stats.pending}
          icon={AlertCircle}
          color={{ bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-500/20' }}
        />
        <StatCard
          title="Sedang Berjalan"
          value={stats.in_progress}
          icon={Clock}
          color={{ bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-500/20' }}
        />
        {user?.role === 'admin' ? (
          <StatCard
            title="Total Pengguna"
            value={stats.totalUsers || 0}
            icon={Users}
            color={{ bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-500/20' }}
          />
        ) : (
          <StatCard
            title="Tugas Selesai"
            value={stats.completed}
            icon={CheckCircle}
            color={{ bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-500/20' }}
          />
        )}
      </div>

      {/* Grid: Charts & Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Progress Chart/Bars (3/5 cols) */}
        <div className="glass rounded-3xl p-6 border border-slate-800/80 lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">Persentase Status Tugas</h3>
            <span className="text-xs text-slate-400">Total Tugas: {stats.total}</span>
          </div>

          {stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 text-sm">
              <span>📊 Belum ada data tugas untuk dianalisis.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress Bar Visual Representation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Selesai
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedPercent}% ({stats.completed} Tugas)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${completedPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sedang Berjalan
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{inProgressPercent}% ({stats.in_progress} Tugas)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${inProgressPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tertunda
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{pendingPercent}% ({stats.pending} Tugas)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${pendingPercent}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Urgent Tasks (2/5 cols) */}
        <div className="glass rounded-3xl p-6 border border-slate-800/80 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">Tugas Perlu Tindakan</h3>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              Lihat semua <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500 text-sm">
                <span>🎉 Bagus! Tidak ada tugas mendesak.</span>
              </div>
            ) : (
              recentTasks.map(task => {
                const isPriority = task.is_priority === 1 || task.is_priority === true;
                return (
                  <div 
                    key={task.id} 
                    className={`bg-slate-950/40 border rounded-2xl p-4 transition-all flex flex-col gap-2 ${
                      isPriority 
                        ? 'border-amber-500/30 hover:border-amber-500/50 shadow-md shadow-amber-500/5 bg-gradient-to-r from-amber-500/5 to-transparent' 
                        : 'border-slate-800 hover:border-slate-750'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isPriority && (
                          <Pin size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                        )}
                        <span className="font-bold text-slate-100 text-sm line-clamp-1">{task.title}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        task.status === 'in_progress' 
                          ? 'bg-amber-50 border border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' 
                          : 'bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                      }`}>
                        {task.status === 'in_progress' ? 'Sedang Berjalan' : 'Tertunda'}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-850 text-[11px] text-slate-450">
                      <span>Tenggat: <span className="font-medium text-slate-355">{formatDate(task.due_date)}</span></span>
                      {user?.role === 'admin' && (
                        <span className="text-indigo-400">Oleh: {task.owner}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
