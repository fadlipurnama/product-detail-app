import { problemResponse, PROBLEM_TYPES } from '../utils/problem-details.js';

/**
 * Catch-all handler for undefined API routes.
 * Returns 404 in RFC 9457 Problem Details format instead of HTML.
 */
export function notFound(req, res) {
  return problemResponse(res, {
    type: PROBLEM_TYPES.ROUTE_NOT_FOUND,
    title: 'Route not found',
    status: 404,
    detail: `No endpoint matches ${req.method} ${req.originalUrl}.`,
    instance: req.originalUrl,
  });
}
