/**
 * RFC 9457 Problem Details type constants.
 */
export const PROBLEM_TYPES = {
  VALIDATION_ERROR: 'https://api.example.com/problems/validation-error',
  INVALID_PRODUCT_ID: 'https://api.example.com/problems/invalid-product-id',
  PRODUCT_NOT_FOUND: 'https://api.example.com/problems/product-not-found',
  ROUTE_NOT_FOUND: 'https://api.example.com/problems/route-not-found',
  UNSUPPORTED_MEDIA_TYPE: 'https://api.example.com/problems/unsupported-media-type',
  INVALID_JSON: 'https://api.example.com/problems/invalid-json',
  INTERNAL_SERVER_ERROR: 'https://api.example.com/problems/internal-server-error',
};

/**
 * Sends an RFC 9457 Problem Details JSON response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {string} options.type - Problem type URI.
 * @param {string} options.title - Short human-readable summary.
 * @param {number} options.status - HTTP status code.
 * @param {string} options.detail - Longer explanation.
 * @param {string} options.instance - Request path.
 * @param {Array<{field: string, message: string}>} [options.errors] - Per-field validation errors.
 */
export function problemResponse(res, { type, title, status, detail, instance, errors }) {
  const body = { type, title, status, detail, instance };
  if (errors !== undefined) body.errors = errors;
  return res.status(status).set('Content-Type', 'application/problem+json').json(body);
}
