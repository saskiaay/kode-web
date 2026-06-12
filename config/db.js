// backend/config/db.js
// Koneksi pool MySQL — dipakai di semua route

const mysql = require('mysql2');
require('dotenv').config();

// Mencegah error ECONNREFUSED saat di Railway dengan mengecek DB_HOST
const isProduction =
  process.env.NODE_ENV === 'production' || process.env.DB_HOST?.includes('railway');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1', // Pakai 127.0.0.1 (IPv4) jika localhost agar tidak terbaca ::1
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: isProduction ? 5 : 10, // Menyesuaikan limit koneksi di cloud
  queueLimit: 0,
  connectTimeout: 10000,
});

module.exports = pool.promise();

// Test koneksi saat server start
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅  Database terhubung:', process.env.DB_NAME || 'voiz_db');
    conn.release();
  } catch (err) {
    console.error('❌  Gagal konek database:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
