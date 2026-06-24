import React from 'react';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 border-b border-slate-800/80">
      {/* Left side: Hamburger menu for mobile and Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:inline-block text-xl font-bold tracking-tight text-white">
          🎯 Task<span className="text-indigo-400">Manager</span>
        </span>
      </div>

      {/* Right side: User Profile Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border-r border-slate-800 pr-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
            <UserIcon size={16} />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-medium text-slate-200">{user?.username}</span>
            <span className="text-xs text-slate-400 capitalize bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50 inline-self-start mt-0.5">
              {user?.role === 'admin' ? '🔑 Admin' : '👤 User'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-3.5 py-2 text-sm font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-200 shadow-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
