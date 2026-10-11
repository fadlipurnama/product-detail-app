import prisma from '../config/prisma.js';

// Shared include for product relations
const includeImages = { orderBy: { position: 'asc' } };
const includeVariants = true;

/**
 * Fetch all products with primary image and variants.
 */
export async function findAll() {
  return prisma.product.findMany({
    include: {
      images: includeImages,
      variants: includeVariants,
    },
    orderBy: { id: 'asc' },
  });
}

/**
 * Fetch a single product by ID with all images (ordered by position) and variants.
 *
 * @param {number|bigint} id - Product ID.
 * @returns {object|null} Product or null if not found.
 */
export async function findById(id) {
  return prisma.product.findUnique({
    where: { id: BigInt(id) },
    include: {
      images: includeImages,
      variants: includeVariants,
    },
  });
}

/**
 * Create a product with images and variants inside a transaction.
 *
 * @param {object} data - Validated product payload.
 * @returns {object} Created product with all relations.
 */
export async function create(data) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: data.name,
        price: data.price,
        currency: data.currency,
        description: data.description,
        images: {
          create: data.images.map((img) => ({
            imageUrl: img.imageUrl,
            altText: img.altText ?? null,
            position: img.position,
            isPrimary: img.isPrimary,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({
            color: v.color ?? null,
            size: v.size ?? null,
            quantity: v.quantity,
          })),
        },
      },
      include: {
        images: includeImages,
        variants: includeVariants,
      },
    });

    return product;
  });
}
