import type { FastifyRequest, FastifyReply } from 'fastify';
import { forbidden } from '../utils/errors.js';
import { sendError } from '../utils/sendError.js';

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { sub: string; role: string };
    if (!roles.includes(user.role)) {
      return sendError(reply, forbidden());
    }
  };
}