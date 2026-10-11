import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { requireJson } from '../middlewares/require-json.js';
import { validateId } from '../middlewares/validate-id.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { createProductSchema } from '../validators/product.validator.js';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List all products
 *     description: Returns every product with primary image and variants.
 *     responses:
 *       '200':
 *         description: Product collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 1
 *                 links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                       example: /api/products
 */
router.get('/', productController.list);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product detail
 *     description: Returns a single product by numeric ID with all images and variants.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product ID (positive integer)
 *     responses:
 *       '200':
 *         description: Product detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                       example: /api/products/1
 *       '400':
 *         description: Invalid product ID
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 */
router.get('/:id', validateId, productController.detail);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     description: |
 *       Creates a product with images and variants in a single transaction.
 *       Requires `Content-Type: application/json`.
 *
 *       **Note:** `variants[].quantity` represents available stock per variant combination,
 *       not the purchase quantity selected in the UI.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             name: Cloud Support Pillow
 *             price: 95
 *             currency: USD
 *             description: Supportive adjustable pillow with a breathable, cool-touch cover for restful sleep.
 *             images:
 *               - imageUrl: https://cdn.example.com/products/cloud-support-pillow.jpg
 *                 altText: Cloud Support Pillow - Main
 *                 position: 0
 *                 isPrimary: true
 *             variants:
 *               - color: White
 *                 size: Standard
 *                 quantity: 25
 *               - color: White
 *                 size: King
 *                 quantity: 15
 *     responses:
 *       '201':
 *         description: Product created
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URI of the newly created product
 *             example: /api/products/2
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationProblem'
 *       '415':
 *         description: Unsupported media type
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 */
router.post(
  '/',
  requireJson,
  validateRequest(createProductSchema),
  productController.create,
);

export default router;
