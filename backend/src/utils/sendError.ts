import type { FastifyReply } from 'fastify';
import { AppError } from './errors.js';

export function sendError(reply: FastifyReply, err: unknown) {
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      error: { code: err.code, message: err.message },
    });
  }
  return reply.status(500).send({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
}
