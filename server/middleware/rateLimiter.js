/**
 * server/middleware/rateLimiter.js  — ARCH-4 fix
 *
 * Three tiers of rate limiting:
 *  1. authLimiter      — strict limit on login / signup to block brute-force
 *  2. mutationLimiter  — moderate limit on recipe creation / updates
 *  3. generalLimiter   — broad catch-all applied to all /api/* routes
 */

const rateLimit = require('express-rate-limit');

// ─── Shared error formatter ───────────────────────────────────────────────────
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: 'Too many requests',
    message: 'You have exceeded the request limit. Please try again later.',
    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
  });
};

// ─── 1. Auth limiter (login & signup) ────────────────────────────────────────
// 10 attempts per 15 minutes per IP — tight enough to block brute-force while
// allowing a reasonable number of legitimate attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,    // Return RateLimit-* headers (RFC 6585)
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: 'Too many authentication attempts. Please wait 15 minutes.',
  skipSuccessfulRequests: true, // Don't count successful logins against the limit
});

// ─── 2. Mutation limiter (recipe create / update / delete) ───────────────────
// 50 writes per 15 minutes per IP — prevents recipe-creation spam.
const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// ─── 3. General API limiter (catch-all) ──────────────────────────────────────
// 100 requests per 15 minutes per IP — baseline protection for all endpoints.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { authLimiter, mutationLimiter, generalLimiter };
