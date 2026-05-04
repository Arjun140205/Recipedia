/**
 * Centralized configuration for the client application.
 *
 * In development  → reads from REACT_APP_API_URL in client/.env
 *                    (e.g. http://localhost:5000/api)
 * In production   → set REACT_APP_API_URL in your hosting dashboard (Render, Vercel, etc.)
 *                    OR fall back to the hardcoded production URL below.
 *
 * NOTE: CRA (Create React App) only exposes env vars prefixed with REACT_APP_.
 */

// API base URL – includes the /api suffix (e.g. https://recipedia-2si5.onrender.com/api)
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://recipedia-2si5.onrender.com/api';

// Server origin without the /api path – useful for constructing asset URLs (avatars, uploads, etc.)
export const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ||
  API_BASE_URL.replace(/\/api\/?$/, '');
