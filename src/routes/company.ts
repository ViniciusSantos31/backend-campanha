
import { FastifyInstance, RouteOptions } from 'fastify';
import { authMiddleware } from '../middlewares/auth';
import { createCompany } from '../services/company';

async function routes(fastify: FastifyInstance, options: RouteOptions) {

  fastify.post('/company', createCompany);

  fastify.get('/company/me',
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });

  fastify.get('/company/:id',
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });

  fastify.get('/company',
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });

  fastify.put('/company/:id',
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });

  fastify.delete('/company/:id',
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });
}

export default routes;