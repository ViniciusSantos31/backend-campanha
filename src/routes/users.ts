
import { FastifyInstance, RouteOptions } from 'fastify';
import { authMiddleware } from '../middlewares/auth';
import {
  createUser,
  getProviders, getUser, getUsers, me, toggleStatus, updateUser
} from '../services/users';

async function routes(fastify: FastifyInstance, options: RouteOptions) {

  fastify.post('/users', options, createUser);

  fastify.get('/users/me', 
    { ...options, preHandler: authMiddleware }, me);

  fastify.get('/users/:id', 
    { ...options, preHandler: authMiddleware }, getUser);

  fastify.get('/users', 
    { ...options, preHandler: authMiddleware }, getUsers);

  fastify.get('/users/providers', 
    { ...options, preHandler: authMiddleware }, getProviders);

  fastify.put('/users/:id', 
    { ...options, preHandler: authMiddleware }, updateUser);
  
  fastify.patch('/users/provider/status', {
    ...options,
    preHandler: authMiddleware,
  }, toggleStatus),

  fastify.delete('/users/:id', 
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });
}

export default routes;