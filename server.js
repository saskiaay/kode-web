// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Impor koneksi database

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Contoh penggunaan di rute
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Database terkoneksi dengan sukses!' });
  });
});

// PENTING: Jika error 'index.html' muncul, pastikan Anda punya folder 'public'
// Jika tidak ada, jangan gunakan app.use(express.static)
// app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server aktif di port ${PORT}`);
});
