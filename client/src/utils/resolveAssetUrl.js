import { SERVER_URL } from '../config';

/**
 * Resolve a relative asset path (e.g. "/uploads/img.jpg") into a full URL
 * using the stable SERVER_URL from config.js.
 *
 * If the path is already absolute (starts with http), it is returned as-is.
 * If the path is falsy, returns the fallback (default: '').
 *
 * @param {string} path - Relative path from the server (e.g. /uploads/filename.jpg)
 * @param {string} [fallback=''] - Fallback value when path is empty/null
 * @returns {string} Fully-qualified URL or fallback
 */
export function resolveAssetUrl(path, fallback = '') {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SERVER_URL}${path}`;
}
