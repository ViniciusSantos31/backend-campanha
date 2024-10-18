import { FastifyInstance, RouteOptions } from "fastify";
import { authMiddleware } from "../middlewares/auth";
import { login, loginAsGuest, logout, refreshToken } from "../services/auth";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post("/login", { ...options }, login);

  fastify.head("/logout", { ...options, preHandler: authMiddleware }, logout);

  fastify.post("/refresh", { ...options }, refreshToken);

  fastify.post("/login/guest", { ...options }, loginAsGuest);
}

export default routes;
