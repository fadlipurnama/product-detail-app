import { z } from 'zod';

// ──────────────── helpers ────────────────

const httpUrl = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .max(2048, 'URL must be at most 2 048 characters')
  .refine((v) => /^https?:\/\/.+/i.test(v), {
    message: 'Must be a valid absolute HTTP or HTTPS URL',
  });

const positiveDecimal2 = z
  .number({ invalid_type_error: 'Must be a number' })
  .positive('Must be a positive number')
  .finite()
  .refine((v) => Number(v.toFixed(2)) === v, {
    message: 'Must have at most 2 decimal places',
  });

// ──────────────── nested schemas ────────────────

const imageSchema = z
  .object({
    imageUrl: httpUrl,
    altText: z.string().trim().max(255).optional(),
    position: z.number().int('Must be an integer').min(0, 'Must be >= 0'),
    isPrimary: z.boolean({ required_error: 'isPrimary is required' }),
  })
  .strict();

const variantSchema = z
  .object({
    color: z
      .string()
      .trim()
      .min(1, 'Must be non-empty')
      .max(50, 'Must be at most 50 characters')
      .nullish()
      .default(null),
    size: z
      .string()
      .trim()
      .min(1, 'Must be non-empty')
      .max(50, 'Must be at most 50 characters')
      .nullish()
      .default(null),
    quantity: z
      .number({ required_error: 'quantity is required' })
      .int('Must be an integer')
      .min(0, 'Must be >= 0')
      .max(10000, 'Must be <= 10 000'),
  })
  .strict()
  .refine((v) => v.color != null || v.size != null, {
    message: 'At least one of color or size must be provided',
  });

// ──────────────── main schema ────────────────

export const createProductSchema = z
  .object({
    name: z
      .string({ required_error: 'name is required' })
      .trim()
      .min(2, 'Must be at least 2 characters')
      .max(120, 'Must be at most 120 characters'),

    price: positiveDecimal2.describe('Selling price'),

    currency: z
      .string()
      .trim()
      .toUpperCase()
      .length(3, 'Must be exactly 3 characters (ISO 4217)')
      .regex(/^[A-Z]{3}$/, 'Must be 3 uppercase letters')
      .default('USD'),

    description: z
      .string({ required_error: 'description is required' })
      .trim()
      .min(10, 'Must be at least 10 characters')
      .max(2000, 'Must be at most 2 000 characters'),

    images: z
      .array(imageSchema, { required_error: 'images is required' })
      .min(1, 'At least one image is required')
      .max(10, 'At most 10 images allowed'),

    variants: z
      .array(variantSchema, { required_error: 'variants is required' })
      .min(1, 'At least one variant is required'),
  })
  .strict({ message: 'Unknown field(s) detected; only documented fields are accepted' })
  .superRefine((data, ctx) => {
    // ── Exactly one primary image ──
    const primaryCount = data.images.filter((img) => img.isPrimary).length;
    if (primaryCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images'],
        message: 'Exactly one image must be marked as isPrimary (found 0)',
      });
    } else if (primaryCount > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images'],
        message: `Exactly one image must be marked as isPrimary (found ${primaryCount})`,
      });
    }

    // ── Unique positions ──
    const positions = data.images.map((img) => img.position);
    const uniquePositions = new Set(positions);
    if (uniquePositions.size !== positions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['images'],
        message: 'Image positions must be unique',
      });
    }

    // ── Unique variant (color, size) combinations ──
    const combos = new Set();
    for (let i = 0; i < data.variants.length; i++) {
      const key = `${(data.variants[i].color ?? '').toLowerCase()}|${(data.variants[i].size ?? '').toLowerCase()}`;
      if (combos.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['variants', i],
          message: `Duplicate variant combination: color="${data.variants[i].color}", size="${data.variants[i].size}"`,
        });
      }
      combos.add(key);
    }
  });
