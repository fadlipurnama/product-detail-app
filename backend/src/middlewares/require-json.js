import { problemResponse, PROBLEM_TYPES } from '../utils/problem-details.js';

/**
 * Middleware that ensures POST requests have Content-Type: application/json.
 * Returns 415 Unsupported Media Type via RFC 9457 Problem Details if not.
 */
export function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return problemResponse(res, {
      type: PROBLEM_TYPES.UNSUPPORTED_MEDIA_TYPE,
      title: 'Unsupported Media Type',
      status: 415,
      detail: 'Content-Type must be application/json.',
      instance: req.originalUrl,
    });
  }
  next();
}
