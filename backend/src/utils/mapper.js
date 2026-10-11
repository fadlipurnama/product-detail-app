/**
 * Database-to-response mappers.
 *
 * Handles:
 * - BigInt → string serialisation
 * - Decimal → JSON number conversion
 * - Extracting primary image URL
 * - Flattening nested relations into the API response shape
 */

/**
 * Map a single Prisma product (with relations) to the API detail response shape.
 *
 * @param {object} product - Prisma product with `images` and `variants` included.
 * @returns {object} API-safe product object.
 */
export function mapProductDetail(product) {
  const primaryImage = product.images?.find((img) => img.isPrimary);

  return {
    id: String(product.id),
    name: product.name,
    price: Number(product.price),
    currency: product.currency,
    description: product.description,
    image: primaryImage?.imageUrl ?? null,
    images: (product.images ?? [])
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        id: String(img.id),
        url: img.imageUrl,
        alt: img.altText ?? null,
        position: img.position,
        isPrimary: img.isPrimary,
      })),
    variants: (product.variants ?? []).map((v) => ({
      id: String(v.id),
      color: v.color,
      size: v.size,
      quantity: v.quantity,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

/**
 * Map a Prisma product (with primary image + variants) to the collection item shape.
 * Identical to detail in this implementation; the repository controls what is included.
 */
export function mapProductSummary(product) {
  return mapProductDetail(product);
}
