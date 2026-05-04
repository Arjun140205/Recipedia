const NodeCache = require('node-cache');

/** Shared in-memory cache. stdTTL = 600 s (10 minutes). */
const apiCache = new NodeCache({ stdTTL: 600 });

/**
 * Express middleware factory.
 * @param {number} duration - Cache TTL in seconds for this specific route.
 */
const cacheMiddleware = (duration) => (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = apiCache.get(key);

  if (cachedResponse) {
    res.json(cachedResponse);
  } else {
    res.originalJson = res.json;
    res.json = (body) => {
      apiCache.set(key, body, duration);
      res.originalJson(body);
    };
    next();
  }
};

module.exports = { apiCache, cacheMiddleware };
