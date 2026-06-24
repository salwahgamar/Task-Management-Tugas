/**
 * Frontend Validation Utilities (JavaScript Dasar: Object, Function, Validation)
 */

export function validateRegister(data) {
  const errors = {};

  if (!data.username || data.username.trim() === '') {
    errors.username = 'Username wajib diisi';
  } else if (data.username.trim().length < 3) {
    errors.username = 'Username minimal 3 karakter';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email wajib diisi';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Format email tidak valid';
  }

  if (!data.password || data.password === '') {
    errors.password = 'Password wajib diisi';
  } else if (data.password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
  }

  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Konfirmasi password tidak cocok';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateLogin(data) {
  const errors = {};

  if (!data.username || data.username.trim() === '') {
    errors.username = 'Username atau email wajib diisi';
  }

  if (!data.password || data.password === '') {
    errors.password = 'Password wajib diisi';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateTask(data) {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Judul tugas wajib diisi';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Judul tugas minimal 3 karakter';
  }

  if (!data.due_date || data.due_date.trim() === '') {
    errors.due_date = 'Tanggal jatuh tempo wajib diisi';
  } else {
    const parsedDate = Date.parse(data.due_date);
    if (isNaN(parsedDate)) {
      errors.due_date = 'Format tanggal tidak valid';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
