// backend/server.js
// Entry point — Voiz API Server

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path'); // Tambahan untuk akses folder

const authRoutes = require('./routes/authRoutes');
const aspirasiRoutes = require('./routes/aspirasiRoutes');
const votingRoutes = require('./routes/votingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── FUNGSI STATIS (MENAMPILKAN HTML/CSS/JS) ───────────────
// Ini agar file HTML di luar folder backend bisa diakses
app.use(express.static(path.join(__dirname, '../'))); 

// ── CORS ──────────────────────────────────────────────────
app.use(
  cors({
    origin: '*', // Diizinkan untuk semua akses dari web kamu
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body Parser ───────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limit ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Terlalu banyak request.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Terlalu banyak percobaan login.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Routes API ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/aspirasi', aspirasiRoutes);
app.use('/api/kategori', aspirasiRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/admin', adminRoutes);

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Voiz API berjalan!', time: new Date().toISOString() });
});

// ── RUTE FRONTEND (TAMPILAN WEB) ──────────────────────────
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/:page', (req, res) => {
  res.sendFile(path.join(__dirname, '../' + req.params.page));
});

// ── 404 (Hanya untuk API yang tidak ketemu) ───────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint API tidak ditemukan.' });
});

// ── Error Handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════╗
║   🎤  VOIZ API — Aktif           ║
║   Port    : ${PORT}                ║
╚══════════════════════════════════╝
  `);
});

module.exports = app;
