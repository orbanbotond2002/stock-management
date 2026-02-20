import type { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import * as reportService from '../services/report.service.js';
import { sendError } from '../utils/sendError.js';

export default async function reportController(fastify: FastifyInstance) {
  fastify.get('/stock-on-hand', { 
    preHandler: authenticate,
    schema: {
      tags: ['Reports'],
      summary: 'Stock on hand report',
      description: 'Returns current stock levels for all products across all warehouses.',
    }
  }, async (request, reply) => {
    try {
      const data = await reportService.getStockOnHand();
      return reply.send(data);
    } catch (err) {
      return sendError(reply, err);
    }
  });
}