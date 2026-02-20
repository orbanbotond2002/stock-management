import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { sendError } from '../utils/sendError.js';
import { validationError } from '../utils/errors.js';
import * as stockMovementService from '../services/stockMovement.service.js';
import { MovementType } from '@prisma/client';

export default async function stockMovementController(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    
    try {
      const movements = await stockMovementService.getAllMovements({
        type: query.type,
        warehouseId: query.warehouseId,
        productId: query.productId,
        startDate: query.startDate,
        endDate: query.endDate
      });
      return reply.send(movements);
    } catch (err) {
      return sendError(reply, err);
    }
  });

  fastify.post('/', { 
    preHandler: [authenticate, requireRole('admin', 'manager')],
    schema: {
      body: {
        type: 'object',
        required: ['type', 'productId', 'quantity'],
        properties: {
          type: { type: 'string', enum: ['IN', 'OUT', 'TRANSFER'] },
          productId: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
          sourceWarehouseId: { type: 'string', description: 'Required for OUT and TRANSFER' },
          targetWarehouseId: { type: 'string', description: 'Required for IN and TRANSFER' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    const user = request.user as { sub: string; role: string };

    try {
      if (!body.type || !body.productId || body.quantity === undefined) {
        throw validationError('type, productId, and quantity are required');
      }
      if (body.quantity <= 0) {
        throw validationError('quantity must be greater than 0');
      }

      let movement;

      switch (body.type) {
        case MovementType.IN:
          if (!body.targetWarehouseId) throw validationError('targetWarehouseId is required for IN movement');
          
          movement = await stockMovementService.processInMovement({
            productId: body.productId,
            targetWarehouseId: body.targetWarehouseId,
            quantity: body.quantity,
            createdBy: user.sub
          });
          break;

        case MovementType.OUT:
          if (!body.sourceWarehouseId) throw validationError('sourceWarehouseId is required for OUT movement');
          
          movement = await stockMovementService.processOutMovement({
            productId: body.productId,
            sourceWarehouseId: body.sourceWarehouseId,
            quantity: body.quantity,
            createdBy: user.sub
          });
          break;

        case MovementType.TRANSFER:
          if (!body.sourceWarehouseId || !body.targetWarehouseId) {
            throw validationError('Both sourceWarehouseId and targetWarehouseId are required for TRANSFER movement');
          }
          
          movement = await stockMovementService.processTransferMovement({
            productId: body.productId,
            sourceWarehouseId: body.sourceWarehouseId,
            targetWarehouseId: body.targetWarehouseId,
            quantity: body.quantity,
            createdBy: user.sub
          });
          break;

        default:
          throw validationError(`Invalid movement type: ${body.type}`);
      }

      return reply.status(201).send(movement);

    } catch (err) {
      return sendError(reply, err);
    }
  });
}