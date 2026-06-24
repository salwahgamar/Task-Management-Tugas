# Sistem Manajemen Tugas (Task Manager) - UAS Project

Aplikasi Sistem Manajemen Tugas Fullstack yang dikembangkan menggunakan **React JS** (Frontend), **Node.js & Express.js** (Backend), serta **MySQL** (Database). Aplikasi ini memenuhi seluruh kriteria Ujian Akhir Semester (UAS), termasuk Autentikasi, Otorisasi (Admin & User), CRUD Lengkap, Dashboard Statistik, Validasi Form, dan Pola Desain MVC.

---

## 🚀 Fitur Utama (Kriteria UAS)

1. **Authentication & Authorization**:
   - Registrasi Akun Baru (User/Admin).
   - Login dengan validasi form (Frontend & Backend).
   - Logout aman dengan JWT token clearance.
   - Hak Akses **Admin**: Dapat melihat, mencari, memperbarui, dan menghapus seluruh tugas dari semua pengguna di sistem.
   - Hak Akses **User**: Hanya dapat mengelola tugas milik mereka sendiri.
2. **Dashboard Interaktif**:
   - Menampilkan total tugas terdaftar.
   - Ringkasan statistik berdasarkan status (Tertunda, Sedang Berjalan, Selesai) dalam bentuk visual persentase bar.
   - Total pengguna terdaftar (hanya untuk Admin).
   - Daftar tugas mendesak terdekat (tenggat waktu terdekat).
3. **Manajemen Tugas (CRUD Lengkap)**:
   - **Create**: Tambah tugas baru dengan judul, deskripsi, tanggal jatuh tempo, dan status.
   - **Read**: Menampilkan daftar tugas dalam bentuk tabel responsif.
   - **Update**: Memperbarui informasi tugas dan status pengerjaan.
   - **Delete**: Menghapus tugas dengan konfirmasi dialog.
4. **Pencarian Data (Query Pencarian)**:
   - Pencarian tugas secara dinamis berdasarkan judul atau deskripsi tugas menggunakan query `LIKE` pada database.
5. **Responsive Design**:
   - Layout dengan Navbar dan Sidebar yang responsif terhadap perangkat mobile/tablet menggunakan Tailwind CSS.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React JS, React Router DOM v6, Axios, Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express JS, MySQL (menggunakan `mysql2`), JSON Web Token (JWT), BcryptJS.
- **Database**: MySQL.

---

## 📁 Struktur Direktori Proyek

```text
task-manager/
├── database.sql           # Skrip inisialisasi database MySQL
├── README.md              # Dokumentasi petunjuk penggunaan
├── backend/               # Kode sumber Express JS (MVC Pattern)
│   ├── src/
│   │   ├── config/        # Konfigurasi koneksi MySQL pool (db.js)
│   │   ├── controllers/   # Logic controller (AuthController, TaskController)
│   │   ├── middleware/    # Auth & role authorization (authMiddleware)
│   │   ├── models/        # OOP Database model queries (UserModel, TaskModel)
│   │   ├── routes/        # Router endpoint (api.js)
│   │   └── app.js         # Express main entry point
│   ├── .env               # File konfigurasi environment backend
│   └── package.json
└── frontend/              # Kode sumber React JS + Vite
    ├── src/
    │   ├── components/    # Reusable components (Navbar, Sidebar, StatCard, etc.)
    │   ├── pages/         # Page screens (Dashboard, Tasks, Login, Register)
    │   ├── services/      # OOP API client & endpoints (api.js, auth.js, task.js)
    │   ├── hooks/         # Custom hooks (useAuth context provider)
    │   ├── layouts/       # Main layout & Auth layout wrapper
    │   ├── utils/         # Helper validations & formatters
    │   ├── App.jsx        # Route definitions
    │   ├── main.jsx       # React DOM entry point
    │   └── index.css      # Tailwind config & global CSS
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🏁 Cara Menjalankan Proyek

### 1. Persiapan Database MySQL
1. Pastikan server MySQL lokal Anda (seperti XAMPP, Laragon, atau MySQL installer resmi) aktif.
2. Buka aplikasi database client Anda (phpMyAdmin, DBeaver, HeidiSQL, dll).
3. Import file `database.sql` yang berada di direktori utama `/task-manager` ke server MySQL Anda. File ini akan otomatis membuat database `task_manager` beserta tabel `users` dan `tasks`.

### 2. Jalankan Backend Server
1. Buka terminal baru dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Pastikan file `.env` di dalam folder `backend` sudah sesuai dengan kredensial MySQL lokal Anda:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=task_manager
   JWT_SECRET=supersecretkeyfortaskmanager123
   ```
3. Jalankan perintah instalasi dependensi (sudah diinstal sebelumnya):
   ```bash
   npm install
   ```
4. Jalankan backend server:
   ```bash
   npm run dev
   ```
   *Catatan: Saat backend pertama kali dijalankan, sistem akan otomatis melakukan **seeding database** (jika tabel users kosong) untuk membuat akun uji coba default.*

### 3. Jalankan Frontend Server (React)
1. Buka terminal baru yang terpisah dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Jalankan perintah instalasi dependensi (sudah diinstal sebelumnya):
   ```bash
   npm install
   ```
3. Jalankan React server:
   ```bash
   npm run dev
   ```
4. Buka tautan lokal yang diberikan oleh Vite di browser Anda (biasanya `http://localhost:5173`).

---

## 🔑 Akun Demo Pengujian

Setelah database di-seeding otomatis saat startup backend, Anda dapat langsung menguji login dengan akun berikut:

### 1. Akun Administrator (Akses Penuh)
- **Username / Email**: `admin` atau `admin@taskmanager.com`
- **Password**: `admin123`
- *Fungsi*: Mengakses dashboard statistik penuh dan mengelola tugas dari seluruh pengguna.

### 2. Akun Standard User (Akses Terbatas)
- **Username / Email**: `user` atau `user@taskmanager.com`
- **Password**: `user123`
- *Fungsi*: Hanya mengelola tugas miliknya sendiri di tabel.
