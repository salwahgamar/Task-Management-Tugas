import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 border-b border-amber-900/40 bg-slate-900/80 backdrop-blur-md">
      {/* Left side: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white tracking-tight">Admin Panel</span>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest">Task Manager</span>
          </div>
        </div>

        {/* Admin badge */}
        <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
          🔑 Administrator
        </span>
      </div>

      {/* Right side: User info & Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right border-r border-slate-800 pr-4">
          <span className="text-sm font-medium text-slate-200">{user?.username}</span>
          <span className="text-xs text-amber-400">Admin</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-3.5 py-2 text-sm font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-200"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
