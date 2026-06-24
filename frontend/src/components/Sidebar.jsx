import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Kelola Tugas',
      path: '/tasks',
      icon: CheckSquare,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 lg:hidden">
          <span className="text-xl font-bold tracking-tight text-white">
            🎯 Task<span className="text-indigo-400">Manager</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Header (only desktop) */}
        <div className="hidden lg:flex h-16 items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-tight text-white">
            🎯 Task<span className="text-indigo-400">Manager</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Role Card (Bottom) */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
              Role Aktif
            </span>
            <span className="text-sm font-bold text-white capitalize">
              {user?.role === 'admin' ? '⚙️ Administrator' : '🧑‍💻 Standard User'}
            </span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {user?.role === 'admin' 
                ? 'Akses penuh untuk mengelola semua tugas pengguna.' 
                : 'Akses terbatas untuk mengelola tugas Anda sendiri.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
