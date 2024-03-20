
import { FastifyInstance, RouteOptions } from 'fastify';
import { authMiddleware } from '../middlewares/auth';
import {
  createUser,
  getProviders, getUser, getUsers, joinQueue, leaveQueue, me, toggleStatus, updateUser
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
  
  fastify.put('/users/provider/status', {
    ...options,
    preHandler: authMiddleware,
  }, toggleStatus),

  fastify.delete('/users/:id', 
    { ...options, preHandler: authMiddleware }, async (request, reply) => { });
  
  fastify.post('/users/queue/join',
    { ...options, preHandler: authMiddleware }, joinQueue
  );

  fastify.post('/users/queue/leave',
    { ...options, preHandler: authMiddleware }, leaveQueue
  );
}

export default routes;