
import { FastifyInstance, RouteOptions } from 'fastify';
import { createCompany } from '../services/company';

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post('/company', createCompany);

  fastify.get('/company/me', async (request, reply) => {  });

  fastify.get('/company/:id', async (request, reply) => { });

  fastify.get('/company', async (request, reply) => { });

  fastify.put('/company/:id', async (request, reply) => { });

  fastify.delete('/company/:id', async (request, reply) => { });
}

export default routes;