import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateLogin } from '../utils/validation';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validasi Frontend ---
    const validation = validateLogin(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Async/Await API Request
      const loggedUser = await login(formData.username, formData.password);
      // Redirect berdasarkan role: admin → /admin, user → /dashboard
      if (loggedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error handling & Loading State
      setApiError(err.message || 'Login gagal. Silakan periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2 text-center font-sans">
        Selamat Datang Kembali
      </h2>
      <p className="text-sm text-slate-400 text-center mb-6">
        Masukan username atau email dan password anda
      </p>

      {apiError && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold px-4 py-3 rounded-xl">
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username or Email */}
        <div>
          <label htmlFor="username" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Username / Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Masukkan username atau email..."
            className={`w-full bg-slate-900 border ${
              errors.username ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
            } rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Password
            </label>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full bg-slate-900 border ${
              errors.password ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
            } rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 mt-6 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Masuk'
          )}
        </button>
      </form>

      {/* Redirect Link */}
      <p className="mt-6 text-center text-sm text-slate-450">
        Belum punya akun?{' '}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Daftar sekarang
        </Link>
      </p>

      {/* Seed Account Help Section */}
      <div className="mt-6 border-t border-slate-800/80 pt-4 text-left">
        <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-2">
          Akun Demo (Database Seeder):
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
            <span className="font-semibold text-slate-300">Admin Panel:</span>
            <p>User: <code className="text-indigo-300">admin</code></p>
            <p>Pass: <code className="text-indigo-300">admin123</code></p>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
            <span className="font-semibold text-slate-300">Standard User:</span>
            <p>User: <code className="text-indigo-300">user</code></p>
            <p>Pass: <code className="text-indigo-300">user123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
