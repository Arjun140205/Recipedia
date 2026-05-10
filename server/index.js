/**
 * server/index.js  — thin entry point
 *
 * Responsibilities:
 *  1. Load environment variables
 *  2. Connect to MongoDB
 *  3. Configure Express (CORS, body-parser, static files, multer, request logging)
 *  4. Mount route modules
 *  5. Global error handler
 *  6. Start the HTTP server
 *
 * Business logic lives in routes/, middleware/, and services/.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ─── Internal modules ─────────────────────────────────────────────────────────
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const externalRoutes = require('./routes/externalRoutes');
const { router: recipeRouter, setUpload: setRecipeUpload } = require('./routes/recipeRoutes');
const { router: userRouter, setUpload: setUserUpload } = require('./routes/userRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const { generalLimiter, mutationLimiter } = require('./middleware/rateLimiter');

// ─── Boot ─────────────────────────────────────────────────────────────────────

// Validate JWT_SECRET early — fail fast rather than at the first authenticated request
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Generate a strong secret and add it to your .env file.');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// ─── Express app setup ────────────────────────────────────────────────────────
const app = express();

// CORS — restricted to whitelisted origins (SEC-7)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / server-to-server calls (origin === undefined) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ─── Rate limiting (ARCH-4) ───────────────────────────────────────────────────
// generalLimiter: 100 req / 15 min per IP — applied to all /api/* routes.
// Auth-specific stricter limits are applied at the route level in authRoutes.js.
app.use('/api', generalLimiter);

// ─── Uploads directory & multer ───────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    // Sanitize filename by removing anything that isn't alphanumeric, dot, hyphen, or underscore
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${Date.now()}-${sanitizedName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Inject the multer instance into routes that need it
setRecipeUpload(upload);
setUserUpload(upload);

// ─── Request logging ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/test', (_req, res) => res.json({ message: 'Server is working!' }));

// ─── Route modules ────────────────────────────────────────────────────────────
app.use('/api', authRoutes);           // POST /api/signup, /api/login  (authLimiter applied inside)
app.use('/api', externalRoutes);       // GET  /api/external-recipes/*, /api/spoonacular/*
app.use('/api/recipes', mutationLimiter, recipeRouter); // CRUD /api/recipes/* — mutationLimiter on writes
app.use('/api/user', userRouter);      // GET/PUT/POST /api/user/*
app.use('/api/creators', creatorRoutes); // GET /api/creators, /api/creators/:userId/recipes

// ─── Frontend Fallback (ARCH-7) ───────────────────────────────────────────────
// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../client/build')));

// Any route that doesn't start with /api or /uploads gets the React app
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
