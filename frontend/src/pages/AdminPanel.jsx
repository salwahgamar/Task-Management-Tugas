import React, { useState, useEffect, useCallback } from 'react';
import { Users, Trash2, Shield, AlertTriangle, X, Search, RefreshCw, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/user';

// Format tanggal Indonesia
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// --- Modal Konfirmasi Hapus ---
const DeleteModal = ({ targetUser, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
    <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-rose-500/10 animate-fade-in">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle size={28} className="text-rose-400" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white text-center mb-1">Hapus Pengguna?</h3>
      <p className="text-slate-400 text-sm text-center mb-5">
        Anda akan menghapus akun{' '}
        <span className="text-rose-400 font-semibold">"{targetUser?.username}"</span> secara permanen.
        Tindakan ini tidak dapat dibatalkan.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          {isDeleting ? 'Menghapus...' : 'Hapus'}
        </button>
      </div>
    </div>
  </div>
);

// --- Role Badge ---
const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
      role === 'admin'
        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
    }`}
  >
    {role === 'admin' ? <Crown size={11} /> : <Users size={11} />}
    {role === 'admin' ? 'Admin' : 'User'}
  </span>
);

// --- Halaman Utama Admin Panel ---
const AdminPanel = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); // user yang akan dihapus
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengguna.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deleteTarget.id);
      setSuccessMsg(`Pengguna "${deleteTarget.username}" berhasil dihapus.`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengguna.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalRegularUsers = users.filter((u) => u.role === 'user').length;

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          targetUser={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 p-6 md:p-8">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <Shield size={11} /> Admin Control Panel
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-sm text-slate-400 max-w-lg">
              Selamat datang, <span className="text-amber-400 font-semibold">{currentUser?.username}</span>. 
              Anda dapat melihat seluruh daftar pengguna terdaftar dan menghapus akun yang tidak diperlukan.
            </p>
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-all text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Alert messages ── */}
      {error && (
        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-xl">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X size={16} /></button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Pengguna',
            value: users.length,
            color: 'amber',
            icon: <Users size={20} className="text-amber-400" />,
          },
          {
            label: 'Total Admin',
            value: totalAdmins,
            color: 'rose',
            icon: <Shield size={20} className="text-rose-400" />,
          },
          {
            label: 'Total User Biasa',
            value: totalRegularUsers,
            color: 'slate',
            icon: <Users size={20} className="text-slate-400" />,
          },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            className={`glass rounded-2xl p-5 border border-${color}-500/20 flex items-center gap-4`}
          >
            <div className={`w-11 h-11 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-2xl font-extrabold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari berdasarkan username atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
        />
      </div>

      {/* ── Users Table ── */}
      <div className="glass rounded-3xl border border-slate-800/80 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white">Daftar Pengguna Terdaftar</h2>
          <span className="text-xs text-slate-400">
            {filteredUsers.length} dari {users.length} pengguna
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-sm gap-2">
            <Users size={32} className="opacity-30" />
            <span>{search ? 'Tidak ada pengguna yang cocok dengan pencarian.' : 'Belum ada pengguna terdaftar.'}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-semibold">ID</th>
                  <th className="text-left px-6 py-3 font-semibold">Username</th>
                  <th className="text-left px-6 py-3 font-semibold">Email</th>
                  <th className="text-left px-6 py-3 font-semibold">Role</th>
                  <th className="text-left px-6 py-3 font-semibold">Bergabung</th>
                  <th className="text-center px-6 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors duration-150 hover:bg-slate-800/30 ${isSelf ? 'bg-amber-500/5' : ''}`}
                    >
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{u.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                            u.role === 'admin'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}>
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200">{u.username}</span>
                            {isSelf && (
                              <span className="ml-2 text-[10px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                                Anda
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        {isSelf ? (
                          <span className="text-xs text-slate-600 italic">—</span>
                        ) : (
                          <button
                            id={`delete-user-${u.id}`}
                            onClick={() => setDeleteTarget(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-medium transition-all duration-200"
                          >
                            <Trash2 size={13} />
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
