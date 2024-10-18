import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { createGuestUserSchema } from "../validations/guest";
import { prisma } from "./prisma";

async function createGuestUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = createGuestUserSchema.parse(request.body);

    const company = await prisma.company.findFirst({
      where: {
        id: user.companyId,
      },
    });

    if (!company) {
      return reply.status(404).send({ message: "Organização não encontrada" });
    }

    await prisma.guestUser.create({
      data: {
        ...user,
      },
    });

    reply.status(201).send();
  } catch (error) {
    if (error instanceof ZodError) {
      const validation_errors = error.errors.map((error) => {
        return { path: error.path[0], message: error.message };
      });
      return reply.status(400).send({ validation_errors });
    }

    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }
}

export { createGuestUser };
