import { FastifyInstance, RouteOptions } from "fastify";
import { authMiddleware } from "../middlewares/auth";
import { closeConference, createConference } from "../services/conference";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post(
    "/api/conference/create",
    {
      ...options,
      preHandler: authMiddleware,
    },
    createConference
  );

  fastify.post(
    "/api/conference/:short/close",
    {
      ...options,
      preHandler: authMiddleware,
    },
    closeConference
  );
}

export default routes;
