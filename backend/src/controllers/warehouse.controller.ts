import type { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { sendError } from '../utils/sendError.js';
import { validationError } from '../utils/errors.js';
import * as warehouseService from '../services/warehouse.service.js';

export default async function warehouseController(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    const warehouses = await warehouseService.getAllWarehouses();
    return reply.send(warehouses);
  });

  fastify.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const warehouse = await warehouseService.getWarehouseById(id);
      return reply.send(warehouse);
    } catch (err) {
      return sendError(reply, err);
    }
  });

  fastify.post('/', {
    preHandler: [authenticate, requireRole('admin')],
    schema: {
        body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' },
            location: { type: 'string' }
        }
        }
    }
    }, async (request, reply) => {
    const body = request.body as { name?: string; location?: string };
    const warehouse = await warehouseService.createWarehouse(body as { name: string; location?: string });
    return reply.status(201).send(warehouse);
  });

  fastify.put('/:id', {
    preHandler: [authenticate, requireRole('admin')],
    schema: {
        body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            location: { type: 'string' }
        }
        }
    }
    }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { name?: string; location?: string };
    try {
      const warehouse = await warehouseService.updateWarehouse(id, body);
      return reply.send(warehouse);
    } catch (err) {
      return sendError(reply, err);
    }
  });

  fastify.delete('/:id', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await warehouseService.deleteWarehouse(id);
      return reply.status(204).send();
    } catch (err) {
      return sendError(reply, err);
    }
  });
}