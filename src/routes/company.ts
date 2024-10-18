import { FastifyInstance, RouteOptions } from "fastify";
import { createCompany } from "../services/company";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.post("/company", createCompany);
}

export default routes;
