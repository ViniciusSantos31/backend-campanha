import { FastifyInstance, RouteOptions } from "fastify";
import { authMiddleware } from "../middlewares/auth";
import { login, loginAsGuest, logout, refreshToken } from "../services/auth";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post("/api/login", { ...options }, login);

  fastify.head(
    "/api/logout",
    { ...options, preHandler: authMiddleware },
    logout
  );

  fastify.post("/api/refresh", { ...options }, refreshToken);

  fastify.post("/api/login/guest", { ...options }, loginAsGuest);
}

export default routes;
