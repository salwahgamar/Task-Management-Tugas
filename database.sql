-- Skrip SQL untuk inisialisasi Database Sistem Manajemen Tugas

-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- 2. Buat Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Buat Tabel Tasks (Data)
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATE NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. INSERT DATA DEFAULT (Demo Accounts)
-- Agar ketika user mengimpor database.sql di phpMyAdmin, data admin dan user langsung terisi.
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@taskmanager.com', '$2a$10$2T5nG26S/dUzsH66HNm8M.eTrz3zs/LvHsmArit8NyDOqrNJmnwga', 'admin'),
(2, 'user', 'user@taskmanager.com', '$2a$10$JgCfPWstA2l4RAn8d4Y4ZuDn2smXdf7jOtG.3OPO1iLrdnhd..hU2', 'user')
ON DUPLICATE KEY UPDATE username=username;

-- 5. Contoh Data Tugas untuk Demo
INSERT INTO tasks (id, title, description, status, due_date, user_id) VALUES
(1, 'Menyelesaikan Laporan UAS', 'Menyusun laporan akhir proyek tugas manajemen tugas.', 'in_progress', '2026-06-30', 2),
(2, 'Mempersiapkan Presentasi Proyek', 'Membuat slide materi presentasi UAS mata kuliah pemrograman web.', 'pending', '2026-07-02', 2),
(3, 'Review Kinerja Server', 'Memantau penggunaan memori dan kapasitas penyimpanan server.', 'completed', '2026-06-23', 1)
ON DUPLICATE KEY UPDATE title=title;
