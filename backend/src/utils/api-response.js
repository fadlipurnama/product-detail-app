/**
 * Sends a successful JSON response with the standard envelope.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {*} options.data - The response payload.
 * @param {object} [options.meta] - Metadata (e.g. total count).
 * @param {object} [options.links] - HATEOAS links.
 * @param {number} [options.statusCode=200] - HTTP status code.
 */
export function successResponse(res, { data, meta, links, statusCode = 200 }) {
  const body = { data };
  if (meta !== undefined) body.meta = meta;
  if (links !== undefined) body.links = links;
  return res.status(statusCode).json(body);
}

/**
 * Sends a 201 Created response with Location header.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {*} options.data - The created resource.
 * @param {string} options.location - URI of the created resource.
 */
export function createdResponse(res, { data, location }) {
  return res.status(201).set('Location', location).json({ data });
}
