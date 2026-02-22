import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import supertest from 'supertest';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import productController from '../controllers/product.controller.js';

vi.mock('../repositories/product.repository.js', () => ({
  findAllProducts: vi.fn().mockResolvedValue([]),
  findProductById: vi.fn().mockResolvedValue(null),
  findProductBySku: vi.fn().mockImplementation((sku: string) => {
    if (sku === 'DUP-SKU') {
      return Promise.resolve({ id: 'product-1', sku: 'DUP-SKU' });
    }
    return Promise.resolve(null);
  }),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  deleteStocksByProductId: vi.fn(),
  countStockMovementsByProductId: vi.fn().mockResolvedValue(0),
}));

const app = Fastify();

beforeAll(async () => {
  app.register(fastifyJwt, { secret: 'test_secret' });
  app.register(productController, { prefix: '/api/v1/products' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('POST /api/v1/products', () => {
  it('should return 409 conflict when SKU already exists', async () => {
    const token = app.jwt.sign({ sub: 'user-1', role: 'admin' });

    const response = await supertest(app.server)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: 'DUP-SKU', name: 'Test product' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: { code: 'CONFLICT', message: 'SKU already exists' },
    });
  });
});
