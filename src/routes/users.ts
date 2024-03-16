
import { FastifyInstance, RouteOptions } from 'fastify';
import { createUser, getProviders, getUser, getUsers } from '../services/users';

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post('/users', createUser);

  fastify.get('/users/me', async (request, reply) => {  });

  fastify.get('/users/:uuid', getUser);

  fastify.get('/users', getUsers);

  fastify.get('/users/providers', getProviders);

  fastify.put('/users/:uuid', async (request, reply) => { });

  fastify.delete('/users/:uuid', async (request, reply) => { });
}

export default routes;