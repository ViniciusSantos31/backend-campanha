import { FastifyInstance, RouteOptions } from "fastify";
import { authMiddleware } from "../middlewares/auth";
import { sendEmail } from "../services/code";
import {
  createUser,
  getProviders,
  getUser,
  getUsers,
  joinQueue,
  leaveQueue,
  me,
  toggleStatus,
  updateUser,
} from "../services/users";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post("/api/users", options, createUser);

  fastify.get("/api/users/me", { ...options, preHandler: authMiddleware }, me);

  fastify.get(
    "/api/users/:id",
    { ...options, preHandler: authMiddleware },
    getUser
  );

  fastify.get(
    "/api/users",
    { ...options, preHandler: authMiddleware },
    getUsers
  );

  fastify.get(
    "/api/users/providers",
    { ...options, preHandler: authMiddleware },
    getProviders
  );

  fastify.post(
    "/api/users/:id",
    {
      ...options,
      preHandler: authMiddleware,
    },
    updateUser
  );

  fastify.put(
    "/api/users/provider/status",
    {
      ...options,
      preHandler: authMiddleware,
    },
    toggleStatus
  ),
    fastify.delete(
      "/api/users/:id",
      { ...options, preHandler: authMiddleware },
      async (request, reply) => {}
    );

  fastify.post(
    "/api/users/queue/join",
    { ...options, preHandler: authMiddleware },
    joinQueue
  );

  fastify.post(
    "/api/users/queue/leave",
    { ...options, preHandler: authMiddleware },
    leaveQueue
  );

  fastify.post("/api/send/email", { ...options }, sendEmail);
}

export default routes;
