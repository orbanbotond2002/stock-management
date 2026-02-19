import type { FastifyInstance } from 'fastify';
import { loginUser } from '../services/auth.service.js';
import '@fastify/jwt';

export default async function authController(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    if (!email || !password)
      return reply.status(400).send({ error: 'Email and password are required' });

    try {
      const result = await loginUser(email, password, fastify.jwt.sign.bind(fastify.jwt));
      return reply.send({ message: 'Successful login', ...result });
    } catch (err: any) {
      return reply.status(err.statusCode || 500).send({ error: err.message });
    }
  });
}