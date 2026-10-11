import { createPrismaClient } from '../src/config/create-prisma-client.js';

const prisma = createPrismaClient();

const productImages = [
  {
    imageUrl: '/assets/images/leesa-bedding-adjustablechillpillow-01.jpg',
    altText: 'Adjustable Chill Pillow - Main',
    position: 0,
    isPrimary: true,
  },
  {
    imageUrl: '/assets/images/adjustable-chill-hand-press-still-02.jpg',
    altText: 'Adjustable Chill Pillow - Hand Press',
    position: 1,
    isPrimary: false,
  },
  ...['03', '04', '05', '06'].map((number, index) => ({
    imageUrl: `/assets/images/leesa-bedding-adjustablechillpillow-${number}.jpg`,
    altText: `Adjustable Chill Pillow - Image ${number}`,
    position: index + 2,
    isPrimary: false,
  })),
];

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert the Adjustable Chill Pillow product
  const product = await prisma.product.upsert({
    where: { id: 1n },
    update: {
      images: {
        deleteMany: {},
        create: productImages,
      },
    },
    create: {
      name: 'Adjustable Chill Pillow',
      price: 89,
      currency: 'USD',
      description:
        'Adjustable cooling pillow with removable fill for a personalized loft. Features a cool-touch cover and customizable support layers for the perfect sleep experience.',
      images: {
        create: productImages,
      },
      variants: {
        create: [
          { color: 'White', size: 'Queen', quantity: 10 },
          { color: 'White', size: 'King', quantity: 8 },
        ],
      },
    },
  });

  console.log(`✅ Seeded product: ${product.name} (ID: ${product.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
