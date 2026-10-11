/**
 * data.js — Data UI lokal yang tidak berasal dari API
 *
 * File ini hanya menyimpan konten statis yang belum tersedia di backend:
 *   nav, footer, features, faq, socialProof, needHelp, promo
 *
 * Data produk inti (name, price, images, variants, description) berasal dari API.
 * localFallbackProduct() digunakan HANYA saat backend tidak tersedia (development offline).
 */

// ─── DATA UI LOKAL ────────────────────────────────────────────────────────────

export const localData = {

  nav: [
    { label: 'Mattresses',       href: '#' },
    { label: 'Adjustable Bases', href: '#' },
    { label: 'Bedding',          href: '#' },
    { label: 'Furniture',        href: '#' },
    { label: 'Sale',             href: '#', highlight: true },
  ],

  topBar: [
    { label: 'Financing',      href: '#' },
    { label: 'Refer a Friend', href: '#' },
    { label: 'Find a Store',   href: '#' },
    { label: 'Account',        href: '#' },
  ],

  promo: {
    badge: '25% OFF',
    message: 'Fall into Savings Event: Up to 30% Off Mattresses',
    save: 30,
  },

  features: [
    {
      svgId: 'icon-pressure',
      title: 'Deconstructed design',
      desc: 'A unique blend of shredded foam and down alternative fibers creates the perfect balance of softness and support.',
    },
    {
      svgId: 'icon-snap',
      title: 'Easy to adjust',
      desc: 'Simply add or remove the cloud-like fill to find your perfect loft. Fluff it up or smooth it down—it\u2019s all up to you.',
    },
    {
      svgId: 'icon-mesh',
      title: 'Cooling cover',
      desc: 'Infused with cooling fibers, this cover pulls heat away from your head and neck, keeping you comfortably cool all night long.',
    },
  ],

  tabs: {
    benefits: [
      'Fully adjustable fill lets you create your ideal loft.',
      'Cool-to-the-touch cover quickly draws away heat.',
      'OEKO-TEX\u00ae STANDARD 100 tested for harmful substances.',
    ],
    bestFor: [
      'People who want a pillow tailored to their unique preferences.',
      'Sleepers who wake up from overheating or night sweats.',
      'Shoppers looking for a pillow that cradles their head, neck, and shoulders.',
    ],
    bonuses: [
      'Free shipping and returns.',
      'Sleep on it with a 30-night, risk-free trial.',
      'Covered by a 1-year limited warranty.',
    ],
  },

  detailSections: [
    {
      image: 'https://images.contentstack.io/v3/assets/bltdab0c7b06198f4c2/blt24a5d9d5dc3b8b2c/67c9f84c20c9dd4ffa1c84a2/detail-img-chill-cover.jpg',
      imageAlt: 'Cooling cover Adjustable Chill Pillow',
      title: 'Cool as a coolcumber',
      desc: 'No more flipping to the cool side, because every side is the cool side. Whether you\u2019re a human starfish or pillow hugger, it stays chill so you can stay asleep.',
      reverse: false,
    },
    {
      image: 'https://images.contentstack.io/v3/assets/bltdab0c7b06198f4c2/blt13f8b71779343a92/67c9f84c809db055f8b561d0/detail-img-chill-fill.jpg',
      imageAlt: 'Fill detail Adjustable Chill Pillow',
      title: "Some say three\u2019s a crowd",
      desc: "But we say it\u2019s a party. Memory foam for support, regular foam for bounce, and down alternative fill for irresistible fluffiness\u2014are you ready to RSVP?",
      reverse: true,
    },
  ],

  specifications: {
    size: { Queen: '20" x 30"', King: '20" x 36"' },
    materials: {
      cover: '70% polyester and 30% polyethylene with nylon zip',
      fillCover: '100% polyester jersey knit',
      fill: '40% polyester fiber, 30% memory foam, and 30% shredded polyethylene foam',
    },
    fillWeight: { King: '90 oz.', Queen: '80 oz.' },
    certification: 'This product has been independently tested and certified against a list of over 350 harmful chemicals according to strict STANDARD 100 by OEKO-TEX\u00ae guidelines.',
    care: {
      outerCover: 'Machine wash cold on the gentle cycle. No bleach. Tumble dry low. Do not iron.',
      fillCover: 'Spot clean with cool water and air dry at room temperature.',
      fill: 'DO NOT wash the fill.',
    },
  },

  shipping: {
    freeShipping: true,
    shippingNote: 'Free shipping in the United States. Each item in your order will ship separately, and you\u2019ll receive an individual tracking number for each one.',
    trial: '30-day',
    trialNote: 'We offer a 30-day, risk-free trial on pillows. If you don\u2019t love them, send them back for a full refund.',
    warranty: '1-year',
    warrantyNote: 'Covered by a 1-year limited warranty.',
  },

  faq: [
    { q: 'Product Specifications', isSpecs: true },
    { q: 'Shipping, Warranty & Returns', isShipping: true },
    { q: 'How does the Adjustable Chill Pillow work?', a: 'The Adjustable Chill Pillow has a washable outer cover and a zippered inner cover filled with shredded foam and polyester fiber. Every pillow comes fully packed with fill so you can adjust it to achieve your desired loft.' },
    { q: 'What is loft?', a: 'Loft refers to the height or thickness of a pillow when it\u2019s lying flat. A pillow with a high loft is thicker, providing more support and elevation, while a pillow with a low loft is thinner and flatter.' },
    { q: 'Are your pillows washable?', a: 'All of our pillow covers are washable. Simply remove the cover, machine wash on a gentle setting, tumble dry low or lay flat to dry. We recommend only spot-cleaning the pillow insert.' },
    { q: 'Is this pillow hypoallergenic?', a: 'Yes, all of Leesa\u2019s pillow inserts and covers are designed to be hypoallergenic.' },
    { q: 'Where is the Adjustable Chill Pillow made?', a: 'The Adjustable Chill Pillow is made with care in China and/or Thailand.' },
  ],

  socialProof: {
    mattressesDonated: 43000,
    heading: 'We make the bed, you make the difference',
    description: 'Since 2015, we have committed to making a positive impact on our communities. We stand firm in the belief that everyone deserves the dignity of a safe and comfortable place to rest. That\u2019s why we\u2019ve donated over 43,000 mattresses to those in need.',
  },

  needHelp: {
    title: 'Need Help?',
    desc: 'Questions? We\u2019re here to help. Call or chat with the Leesa Comfort Crew.',
    phone: '1-844-335-3372',
    chatLabel: 'Chat',
  },

  breadcrumb: [
    { label: 'Home',    href: '#' },
    { label: 'Bedding', href: '#' },
  ],

  footer: {
    shop:    [{ label: 'All Mattresses', href: '#' }, { label: 'Hybrid Innerspring Mattresses', href: '#' }, { label: 'Cooling Mattresses', href: '#' }, { label: 'Memory Foam Mattresses', href: '#' }, { label: 'Bedding', href: '#' }, { label: 'Kids', href: '#' }, { label: 'Furniture', href: '#' }],
    about:   [{ label: 'Our Story', href: '#' }, { label: 'Our Social Impact', href: '#' }, { label: 'Sustainability', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Reviews', href: '#' }],
    support: [{ label: 'Contact Us', href: '#' }, { label: 'Return Policy', href: '#' }, { label: 'Warranty', href: '#' }, { label: 'FAQs', href: '#' }, { label: 'Financing', href: '#' }, { label: 'Web Accessibility', href: '#' }],
    social: [
      { label: 'Facebook',  href: '#', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
      { label: 'Instagram', href: '#', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' },
      { label: 'YouTube',   href: '#', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>' },
      { label: 'Pinterest', href: '#', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>' },
      { label: 'TikTok',   href: '#', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-6.13 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.16 8.16 0 0 0 4.77 1.52V7.01a4.85 4.85 0 0 1-1-.32z"/></svg>' },
    ],
    hours: 'Monday \u2013 Friday: 10 a.m. \u2013 7 p.m. ET\nSaturday \u2013 Sunday: 10 a.m. \u2013 6 p.m. ET',
    copyright: '\u00a9 Leesa Sleep 2026',
    legal: [
      { label: 'Privacy Policy',    href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Cookie Policy',     href: '#' },
    ],
  },
};

// ─── FALLBACK PRODUK LOKAL (development offline only) ─────────────────────────
/**
 * Mengembalikan data produk hardcoded yang digunakan HANYA saat backend tidak tersedia.
 * Format sama persis dengan response API agar app.js tidak perlu tahu perbedaannya.
 *
 * @returns {import('./api.js').Product}
 */
// export function localFallbackProduct() {
//   return {
//     id: 1,
//     name: 'Adjustable Chill Pillow',
//     price: 89,
//     currency: 'USD',
//     image: '/assets/lesa-bedding-adjustablechillpilow-01.jpg',
//     images: [
//       { url: '/assets/lesa-bedding-adjustablechillpilow-01.jpg', alt: 'Leesa Adjustable Chill Pillow 1', position: 0 },
//       { url: '/assets/images/adjustable-chill-hand-press-still-02.jpg', alt: 'Leesa Adjustable Chill Pillow 2', position: 1 },
//       { url: '/assets/images/lesa-adjustable-chill-pillow-03.jpg', alt: 'Leesa Adjustable Chill Pillow 3', position: 2 },
//       { url: '/assets/images/lesa-adjustable-chill-pillow-04.jpg', alt: 'Leesa Adjustable Chill Pillow 4', position: 3 },
//       { url: '/assets/images/lesa-adjustable-chill-pillow-05.jpg', alt: 'Leesa Adjustable Chill Pillow 5', position: 4 },
//       { url: '/assets/images/lesa-adjustable-chill-pillow-06.jpg', alt: 'Leesa Adjustable Chill Pillow 6', position: 5 },
//     ],
//     variants: {
//       size: ['Queen', 'King'],
//       color: [],
//       quantity: 10,
//     },
//     description: 'Adjustable cooling pillow with removable fill for a personalized loft. The cool-to-the-touch cover quickly draws away heat.',
//     originalPrice: 119,
//     promo: { badge: '25% OFF', save: 30 },
//   };
// }
