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

const pool = mysql.createPool(dbConfig);

const promisePool = pool.promise();

promisePool
  .query('SELECT 1')
  .then(() => {
    console.log(`✅ Database terhubung: ${dbConfig.database}`);
  })
  .catch((err) => {
    console.error('❌ Gagal konek database:', err.message);
  });

module.exports = promisePool;

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal konek database:', err.message);
  } else {
    console.log(`✅ Database terhubung: ${dbConfig.database}`);
    connection.release();
  }
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
