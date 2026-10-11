import { problemResponse, PROBLEM_TYPES } from '../utils/problem-details.js';

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 * On failure, returns 400 with per-field validation errors.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 */
export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(root)',
        message: issue.message,
      }));

      return problemResponse(res, {
        type: PROBLEM_TYPES.VALIDATION_ERROR,
        title: 'Request validation failed',
        status: 400,
        detail: 'One or more fields are invalid.',
        instance: req.originalUrl,
        errors,
      });
    }

    // Replace body with validated & transformed data (trimmed, defaults applied)
    req.body = result.data;
    next();
  };
}
