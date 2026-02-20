import type { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import * as productService from '../services/product.service.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validationError } from '../utils/errors.js';
import { sendError } from '../utils/sendError.js';

export default async function productController(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    const { search } = request.query as { search?: string };
    const products = await productService.getAllProducts(search);
    return reply.send(products);
  });

  fastify.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const product = await productService.getProductById(id);
      return reply.send(product);
    } catch (err: any) {
      return sendError(reply, err);
    }
  });

  fastify.post('/', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    const body = request.body as { sku: string; name: string; description?: string };

    if (!body?.sku || !body?.name) {
        return sendError(reply, validationError('sku and name are required'));
    }

    const product = await productService.createProduct(body);
    return reply.status(201).send(product);
  });

  fastify.put('/:id', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { sku?: string; name?: string; description?: string };
    if (!body?.sku || !body?.name) {
        return sendError(reply, validationError('sku and name are required'));
    }
    try {
      const product = await productService.updateProduct(id, body);
      return reply.send(product);
    } catch (err: any) {
      return sendError(reply, err);
    }
  });

  fastify.delete('/:id', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await productService.deleteProduct(id);
      return reply.status(204).send();
    } catch (err: any) {
      return sendError(reply, err);
    }
  });
}