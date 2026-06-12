// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const aspirasiRoutes = require('./routes/aspirasiRoutes');
const votingRoutes = require('./routes/votingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. IZINKAN FILE STATIS (HTML, CSS, JS)
// Karena server.js di dalam /backend, kita naik satu tingkat (../) ke folder utama
app.use(express.static(path.join(__dirname, '../'))); 

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. RATE LIMITING
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// 4. ROUTE API
app.use('/api/auth', authRoutes);
app.use('/api/aspirasi', aspirasiRoutes);
app.use('/api/kategori', aspirasiRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/admin', adminRoutes);

// 5. ROUTE FRONTEND (TAMPILAN WEB)
// Mengarahkan ke index.html di folder utama (di luar backend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Menangani file HTML lain seperti dashboard.html, admin.html
app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, '../' + req.params.page));
});

// 6. ERROR HANDLING
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

app.listen(PORT, () => {
    console.log(`Server aktif di port ${PORT}`);
});
