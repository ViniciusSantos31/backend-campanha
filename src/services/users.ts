import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { exclude } from "../utils/excludeField";
import { createUserSchema, paramsUserSchema } from "../validations/user";

const prisma = new PrismaClient();



async function createUser(request: FastifyRequest, reply: FastifyReply) {

  try {
    const user = createUserSchema.parse(request.body);
    
    const isRegistered = await prisma.user.findFirst({
      where: {
        email: user.email,
        companyId: user.companyId
      },
    });

    if (isRegistered) {
      return reply.status(409).send({
        message: "Email já cadastrado nesta organização"
      });
    }

    const company = await prisma.company.findFirst({
      where: {
        uuid: user.companyId,
      }
    })

    if (!company) {
      return reply.status(404).send({ message: "Organização não encontrada" });
    }

    await prisma.user.create({
      data: user,
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

async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc'
      },
    });

    const usersWithoutPassword = users.map((user) => {
      return exclude(user, ['password']);
    });

    reply.send({ users: usersWithoutPassword })
  } catch (error) {
    if (error instanceof Error)
      reply.status(500).send({ message: error.message });
  }
}

async function getUser(request: FastifyRequest, reply: FastifyReply) {
  try {

    const { uuid } = paramsUserSchema.parse(request.params);
    const user = await prisma.user.findFirst({
      where: {
        uuid,
      },
    });
  
    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }
  
    reply.send(user);
  } catch (error) {
    if (error instanceof Error)
      reply.status(500).send({ message: error.message });
  }
}

async function getProviders(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany({
      where: {
        userType: 'PROVIDER'
      },
      orderBy: {
        status: 'asc'
      }
    });
    reply.send({ users });
  } catch (error) {
    if (error instanceof Error)
      reply.status(500).send({ message: error.message });
  }
}

export { createUser, getProviders, getUser, getUsers };

