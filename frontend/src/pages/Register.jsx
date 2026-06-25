import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateRegister } from '../utils/validation';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
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
    const validation = validateRegister(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Async/Await & Fetch/Axios (wrapped in authService/useAuth)
      const res = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      );
      
      // Success state
      alert(res.message || 'Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      // Error handling
      setApiError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2 text-center">
        Daftar Akun Baru
      </h2>
      <p className="text-sm text-slate-400 text-center mb-6">
        Lengkapi formulir untuk membuat akun Anda.
      </p>

      {apiError && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold px-4 py-3 rounded-xl">
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="contoh: budi123"
            className={`w-full bg-slate-900 border ${
              errors.username ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
            } rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contoh: budi@email.com"
            className={`w-full bg-slate-900 border ${
              errors.email ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
            } rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Password
          </label>
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

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Konfirmasi Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full bg-slate-900 border ${
              errors.confirmPassword ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:ring-indigo-500/20'
            } rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:border-indigo-500 transition-all text-sm`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>
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
            'Daftar Sekarang'
          )}
        </button>
      </form>

      {/* Redirect Link */}
      <p className="mt-6 text-center text-sm text-slate-450">
        Sudah memiliki akun?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Login di sini
        </Link>
      </p>
    </div>
  );
};

export default Register;
