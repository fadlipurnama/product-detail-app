import { problemResponse, PROBLEM_TYPES } from '../utils/problem-details.js';

/**
 * Global Express error handler.
 * - Converts JSON parse errors to 400 Problem Details.
 * - Converts all other errors to 500 without exposing stack traces.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // JSON parse error from express.json()
  if (err.type === 'entity.parse.failed') {
    return problemResponse(res, {
      type: PROBLEM_TYPES.INVALID_JSON,
      title: 'Invalid JSON',
      status: 400,
      detail: 'The request body contains malformed JSON.',
      instance: req.originalUrl,
    });
  }

  // Body too large
  if (err.type === 'entity.too.large') {
    return problemResponse(res, {
      type: PROBLEM_TYPES.VALIDATION_ERROR,
      title: 'Payload too large',
      status: 413,
      detail: 'Request body exceeds the 100 KB limit.',
      instance: req.originalUrl,
    });
  }

  // Log internally; never expose to client
  console.error('Unhandled error:', err);

  return problemResponse(res, {
    type: PROBLEM_TYPES.INTERNAL_SERVER_ERROR,
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred.',
    instance: req.originalUrl,
  });
}
