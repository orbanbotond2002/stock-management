import Fastify from 'fastify';
import authController from './controllers/auth.controller.js';
import fastifyJwt from '@fastify/jwt';
import { API_PREFIX } from './config/constants.js';

const fastify = Fastify({
  logger: true
});

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error('JWT_SECRET environment variable is not set');

fastify.register(fastifyJwt, { secret: jwtSecret });

fastify.register(authController, { prefix: `${API_PREFIX}/auth` });

fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000 address');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();