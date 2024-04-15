
import { FastifyInstance, RouteOptions } from 'fastify';
import { changePassword, resendCode, sendEmail, verifyCode, verifyCodeId } from '../services/code';

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post('/recovery/request', { ...options }, sendEmail);

  fastify.post('/recovery/confirm', { ...options }, verifyCode);

  fastify.post('/recovery/reset/:id', { ...options }, changePassword);

  fastify.get('/recovery/verify/:codeId', { ...options }, verifyCodeId);

  fastify.patch('/recovery/resend/:codeId', { ...options }, resendCode);
}

export default routes;