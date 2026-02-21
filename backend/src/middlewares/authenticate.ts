import type { FastifyRequest, FastifyReply } from 'fastify';
import { sendError } from '../utils/sendError.js';
import { authenticationError } from '../utils/errors.js';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return sendError(reply, authenticationError());
  }
}
