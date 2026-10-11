import * as productService from '../services/product.service.js';
import { successResponse, createdResponse } from '../utils/api-response.js';
import { problemResponse, PROBLEM_TYPES } from '../utils/problem-details.js';

function absoluteImageUrls(product, req) {
  const origin = `${req.protocol}://${req.get('host')}`;
  const resolveUrl = (url) => (url ? new URL(url, origin).toString() : url);

  return {
    ...product,
    image: resolveUrl(product.image),
    images: product.images.map((image) => ({
      ...image,
      url: resolveUrl(image.url),
    })),
  };
}

/**
 * GET /api/products — list all products.
 */
export async function list(req, res, next) {
  try {
    const products = await productService.listProducts();
    return successResponse(res, {
      data: products.map((product) => absoluteImageUrls(product, req)),
      meta: { total: products.length },
      links: { self: '/api/products' },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id — product detail.
 */
export async function detail(req, res, next) {
  try {
    const { found, product } = await productService.getProductById(req.params.id);

    if (!found) {
      return problemResponse(res, {
        type: PROBLEM_TYPES.PRODUCT_NOT_FOUND,
        title: 'Product not found',
        status: 404,
        detail: `No product with ID ${req.params.id} exists.`,
        instance: req.originalUrl,
      });
    }

    const productWithAbsoluteImageUrls = absoluteImageUrls(product, req);
    return successResponse(res, {
      data: productWithAbsoluteImageUrls,
      links: { self: `/api/products/${req.params.id}` },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/products — create product.
 */
export async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);

    return createdResponse(res, {
      data: absoluteImageUrls(product, req),
      location: `/api/products/${product.id}`,
    });
  } catch (err) {
    next(err);
  }
}
