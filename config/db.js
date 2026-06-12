// backend/config/db.js
// Koneksi pool MySQL — dipakai di semua route

const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'railway',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000,
};

// 1. Buat pool koneksi
const pool = mysql.createPool(dbConfig);

// 2. Ambil versi promise-nya untuk dipakai async/await di file routes
const promisePool = pool.promise();

// 3. Tes koneksi yang aman (Anti-Crash)
promisePool.query('SELECT 1')
  .then(() => {
    console.log(`✅ Database terhubung ke: ${dbConfig.database}`);
  })
  .catch((err) => {
    console.error('❌ Gagal konek database:', err.message);
    // Tidak memakai process.exit(1) agar server tidak dipaksa mati
  });

// 4. Cukup ekspor promisePool SATU KALI saja di paling bawah
module.exports = promisePool;
