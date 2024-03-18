
import { FastifyInstance, RouteOptions } from 'fastify';
import { authMiddleware } from '../middlewares/auth';
import {
  login, logout,
} from '../services/auth';

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post('/login', { ...options }, login);

  fastify.head('/logout', { ...options, preHandler: authMiddleware }, logout);
  

}

export default routes;