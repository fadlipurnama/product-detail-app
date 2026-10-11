import { problemResponse, PROBLEM_TYPES } from '../utils/problem-details.js';

/**
 * Middleware that validates :id route parameter as a positive integer.
 * Converts the string param to a Number on req.params.id for downstream use.
 */
export function validateId(req, res, next) {
  const raw = req.params.id;
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    return problemResponse(res, {
      type: PROBLEM_TYPES.INVALID_PRODUCT_ID,
      title: 'Invalid product ID',
      status: 400,
      detail: `Product ID must be a positive integer. Received: "${raw}".`,
      instance: req.originalUrl,
    });
  }

  req.params.id = id;
  next();
}
