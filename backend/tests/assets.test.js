import { describe, expect, it } from 'vitest';
import supertest from 'supertest';
import app from '../src/app.js';

const request = supertest(app);
const imageFiles = [
  'leesa-bedding-adjustablechillpillow-01.jpg',
  'adjustable-chill-hand-press-still-02.jpg',
  'leesa-bedding-adjustablechillpillow-03.jpg',
  'leesa-bedding-adjustablechillpillow-04.jpg',
  'leesa-bedding-adjustablechillpillow-05.jpg',
  'leesa-bedding-adjustablechillpillow-06.jpg',
];

describe('GET /assets/images/:filename', () => {
  it.each(imageFiles)('serves %s', async (filename) => {
    const response = await request.get(`/assets/images/${filename}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/^image\/jpeg/);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
