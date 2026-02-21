import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import authController from '../controllers/auth.controller.js';

const app = Fastify();

beforeAll(async () => {
  app.register(fastifyJwt, { secret: 'test_secret' });
  app.register(authController, { prefix: '/api/v1/auth' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('POST /api/v1/auth/login', () => {
  it('should return 200 and token on valid credentials', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@helixsoft.com', password: 'admin123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.role).toBe('admin');
  });

  it('should return 401 on invalid credentials', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@helixsoft.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
  });

  it('should return 400 if body is missing', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/auth/login')
      .send({});

    expect(response.status).toBe(400);
  });
});
