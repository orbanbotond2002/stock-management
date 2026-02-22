import type { FastifyReply } from 'fastify';
import { Prisma } from '@prisma/client';
import { AppError } from './errors.js';

export function sendError(reply: FastifyReply, err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta as { target?: unknown } | undefined)?.target;
      const fields = Array.isArray(target)
        ? target.filter((t): t is string => typeof t === 'string')
        : typeof target === 'string'
          ? [target]
          : [];

      const message = fields.includes('sku')
        ? 'SKU already exists'
        : 'Resource already exists';

      return reply.status(409).send({
        error: { code: 'CONFLICT', message },
      });
    }
  }

  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      error: { code: err.code, message: err.message },
    });
  }
  return reply.status(500).send({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
}
