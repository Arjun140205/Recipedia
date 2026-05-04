const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware: verify Bearer JWT and attach decoded payload to req.user.
 * Returns 403 if the token is missing or invalid.
 */
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Log only the error type/message — never the token value
    console.error('Token verification failed:', err.name, err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
