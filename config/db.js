// backend/config/db.js
// Koneksi pool MySQL — dipakai di semua route

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'voiz_db',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+07:00',
  charset: 'utf8mb4',
});

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
