import type { SwaggerOptions } from '@fastify/swagger';
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

export const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      title: 'HelixSoft Stock Management API',
      description: 'API dokumentáció a készletkezelő platformhoz',
      version: '1.0.0'
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Írd be: Bearer <token>'
      }
    },
    security: [{ bearerAuth: [] }]
  }
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
};