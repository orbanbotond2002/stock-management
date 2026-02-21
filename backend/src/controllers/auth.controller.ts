import type { FastifyInstance } from 'fastify';
import { loginUser } from '../services/auth.service.js';
import '@fastify/jwt';

export default async function authController(fastify: FastifyInstance) {
  fastify.post<{ Body: { email: string; password: string } }>(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      if (!email || !password)
        return reply
          .status(400)
          .send({ error: 'Email and password are required' });

      try {
        const result = await loginUser(
          email,
          password,
          fastify.jwt.sign.bind(fastify.jwt)
        );
        return reply.send({ message: 'Successful login', ...result });
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        return reply
          .status(error.statusCode || 500)
          .send({ error: error.message });
      }
    }
  );
}
