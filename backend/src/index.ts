import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import authController from './controllers/auth.controller.js';
import fastifyJwt from '@fastify/jwt';
import { API_PREFIX } from './config/constants.js';
import productController from './controllers/product.controller.js';
import warehouseController from './controllers/warehouse.controller.js';
import stockMovementController from './controllers/stockMovement.controller.js';
import { swaggerOptions, swaggerUiOptions } from './config/swagger.config.js';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import reportController from './controllers/report.controller.js';

const fastify = Fastify({
  logger: true,
});

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error('JWT_SECRET environment variable is not set');

fastify.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN ?? '*',
  credentials: true,
});

fastify.register(swagger, swaggerOptions);
fastify.register(swaggerUi, swaggerUiOptions);

fastify.register(fastifyJwt, { secret: jwtSecret });

fastify.register(authController, { prefix: `${API_PREFIX}/auth` });

fastify.register(productController, { prefix: `${API_PREFIX}/products` });

fastify.register(warehouseController, { prefix: `${API_PREFIX}/warehouses` });

fastify.register(stockMovementController, {
  prefix: '/api/v1/stock-movements',
});

fastify.register(reportController, { prefix: `${API_PREFIX}/reports` });

fastify.get('/health', async () => {
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
