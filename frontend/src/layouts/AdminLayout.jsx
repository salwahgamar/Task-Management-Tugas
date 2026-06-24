import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Jika belum login, redirect ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika bukan admin, redirect ke dashboard user
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin Navbar */}
        <AdminNavbar />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 relative">
          {/* Decorative Blur Backgrounds — amber theme */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-600/5 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="relative z-10 max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
