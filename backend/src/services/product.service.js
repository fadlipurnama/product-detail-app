import * as productRepository from '../repositories/product.repository.js';
import { mapProductSummary, mapProductDetail } from '../utils/mapper.js';

/**
 * Use case: list all products.
 */
export async function listProducts() {
  const products = await productRepository.findAll();
  return products.map(mapProductSummary);
}

/**
 * Use case: get product detail by ID.
 *
 * @param {number} id - Product ID.
 * @returns {{ found: boolean, product?: object }}
 */
export async function getProductById(id) {
  const product = await productRepository.findById(id);
  if (!product) {
    return { found: false };
  }
  return { found: true, product: mapProductDetail(product) };
}

/**
 * Use case: create a new product.
 *
 * @param {object} data - Validated CreateProductRequest body.
 * @returns {object} Created product in API response shape.
 */
export async function createProduct(data) {
  const product = await productRepository.create(data);
  return mapProductDetail(product);
}
