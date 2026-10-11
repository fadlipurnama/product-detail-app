import swaggerJsdoc from 'swagger-jsdoc';

/**
 * OpenAPI 3.1 specification generated via swagger-jsdoc.
 *
 * Component schemas are defined inline here.
 * Endpoint documentation lives in JSDoc comments inside route files.
 */
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Product Catalog API',
      version: '1.0.0',
      description:
        'REST API for the Product Catalog — supports listing, detail, and creation of products with images and variants. Built with Node.js, Express, Prisma, and PostgreSQL.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local development',
      },
    ],
    components: {
      schemas: {
        // ─── Product (response) ───
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            name: { type: 'string', example: 'Adjustable Chill Pillow' },
            price: { type: 'number', format: 'double', example: 89.0 },
            currency: { type: 'string', example: 'USD' },
            description: {
              type: 'string',
              example: 'Adjustable cooling pillow with removable fill for a personalized loft.',
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'Primary product image URL',
              example: 'http://localhost:3000/assets/images/leesa-bedding-adjustablechillpillow-01.jpg',
            },
            images: {
              type: 'array',
              items: { $ref: '#/components/schemas/ProductImage' },
            },
            variants: {
              type: 'array',
              items: { $ref: '#/components/schemas/ProductVariant' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── ProductImage (response) ───
        ProductImage: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            url: { type: 'string', format: 'uri' },
            alt: { type: 'string', nullable: true },
            position: { type: 'integer', example: 0 },
            isPrimary: { type: 'boolean' },
          },
        },

        // ─── ProductVariant (response) ───
        ProductVariant: {
          type: 'object',
          description:
            'A specific variant combination. `quantity` is available stock per variant, NOT the purchase quantity selected by the customer in the UI.',
          properties: {
            id: { type: 'string', example: '1' },
            color: { type: 'string', nullable: true, example: 'White' },
            size: { type: 'string', nullable: true, example: 'Queen' },
            quantity: {
              type: 'integer',
              minimum: 0,
              maximum: 10000,
              example: 10,
              description: 'Available stock for this variant (0 = out of stock)',
            },
          },
        },

        // ─── CreateProductRequest (POST body) ───
        CreateProductRequest: {
          type: 'object',
          required: ['name', 'price', 'description', 'images', 'variants'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 120 },
            price: { type: 'number', exclusiveMinimum: 0, description: 'Max 2 decimal places' },
            currency: { type: 'string', minLength: 3, maxLength: 3, default: 'USD' },
            description: { type: 'string', minLength: 10, maxLength: 2000 },
            images: {
              type: 'array',
              minItems: 1,
              maxItems: 10,
              items: {
                type: 'object',
                required: ['imageUrl', 'position', 'isPrimary'],
                properties: {
                  imageUrl: { type: 'string', format: 'uri' },
                  altText: { type: 'string', maxLength: 255 },
                  position: { type: 'integer', minimum: 0 },
                  isPrimary: { type: 'boolean' },
                },
                additionalProperties: false,
              },
              description: 'Exactly one image must have isPrimary=true; positions must be unique',
            },
            variants: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  color: { type: 'string', maxLength: 50, nullable: true },
                  size: { type: 'string', maxLength: 50, nullable: true },
                  quantity: { type: 'integer', minimum: 0, maximum: 10000 },
                },
                additionalProperties: false,
                description: 'At least one of color or size must be provided; (color,size) must be unique across variants',
              },
            },
          },
          additionalProperties: false,
        },

        // ─── RFC 9457 Problem Details ───
        ProblemDetails: {
          type: 'object',
          properties: {
            type: { type: 'string', format: 'uri' },
            title: { type: 'string' },
            status: { type: 'integer' },
            detail: { type: 'string' },
            instance: { type: 'string' },
          },
        },

        ValidationProblem: {
          allOf: [
            { $ref: '#/components/schemas/ProblemDetails' },
            {
              type: 'object',
              properties: {
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string', example: 'price' },
                      message: { type: 'string', example: 'Must be a positive number' },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const openapiSpec = swaggerJsdoc(options);

export default openapiSpec;
