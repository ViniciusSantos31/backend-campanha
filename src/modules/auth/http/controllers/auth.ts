import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

import { loginSchema } from "../validators/auth";

const prisma = new PrismaClient();

async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = loginSchema.parse(request.body);

    
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }
}