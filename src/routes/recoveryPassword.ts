import { FastifyInstance, RouteOptions } from "fastify";
import {
  changePassword,
  resendCode,
  sendEmail,
  verifyCode,
  verifyCodeId,
} from "../services/code";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post("/api/recovery/request", { ...options }, sendEmail);

  fastify.post("/api/recovery/confirm", { ...options }, verifyCode);

  fastify.post("/api/recovery/reset/:id", { ...options }, changePassword);

  fastify.get("/api/recovery/verify/:codeId", { ...options }, verifyCodeId);

  fastify.patch("/recovery/resend/:codeId", { ...options }, resendCode);
}

export default routes;
