import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { exclude } from "../utils/excludeField";

import bycript from 'bcrypt';

import jwt from 'jsonwebtoken';

import { socket } from "../socket/server";
import { createUserSchema, editUserSchema, paramsUserSchema } from "../validations/user";
import { prisma } from "./prisma";


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
        id: user.companyId,
      }
    })

    if (!company) {
      return reply.status(404).send({ message: "Organização não encontrada" });
    }

    const passwordHash = await bycript.hash(user.password, 8);

    await prisma.user.create({
      data: {
        ...user,
        password: passwordHash
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

    const { id } = paramsUserSchema.parse(request.params);
    const user = await prisma.user.findFirst({
      where: {
        id,
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

    const usersWithoutPassword = users.map((user) => {
      return exclude(user, ['password']);
    });

    reply.send({ users: usersWithoutPassword });
  } catch (error) {
    if (error instanceof Error)
      reply.status(500).send({ message: error.message });
  }
}

async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = paramsUserSchema.parse(request.params);
    const user = editUserSchema.parse(request.body);

    const userExists = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: user,
    });
    if (user.userType === 'PROVIDER')
      socket.emit('user_status_changed');

    reply.send();
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

async function uploadImage(request: FastifyRequest, reply: FastifyReply) { }

async function toggleStatus(request: FastifyRequest, reply: FastifyReply) { 
  try {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token)
      return reply.status(401).send({ message: "Token não informado" });

    const { id } =
      jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) 
      return reply.status(404).send({ message: "Usuário não encontrado" })

    if (user.userType !== 'PROVIDER')
      return reply.status(401).send({
        message: "Você não tem permissão para realizar esta ação."
      })
    
      
    const userUpdated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        status: user.status === 'PAUSED' ? 'AVAILABLE' : 'PAUSED'
      }
    })
      
    socket.emit("user_status_changed", user.id);
    
    const usersInQueue = await prisma.user.findMany({
      where: {
        status: 'AVAILABLE',
        userType: 'REQUESTER',
      },
      orderBy: {
        inQueueSince: 'asc',
      }
    });

    if (usersInQueue.length > 0 && userUpdated.status === 'AVAILABLE') {
      socket.emit("new_user_in_queue", usersInQueue[0]);
    }

    reply.status(200).send();
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }
}

async function me(request: FastifyRequest, reply: FastifyReply) {

  const token = request.headers.authorization?.split(' ')[1];

  if (!token) return reply.status(401).send({ message: "Token não informado" });

  const { id } =
    jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
  

  const me = await prisma.user.findFirst({
    where: {
      id,
    }
  });

  if (!me) return reply.status(404).send({ message: "Usuário não encontrado" });

  const meWithoutPassword = exclude(me, ["password"]);

  reply.send(meWithoutPassword);
}

async function joinQueue(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return reply.status(401).send({ message: "Token não informado" });

    const { id } =
      jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) return reply.status(404).send(
      { message: "Usuário não encontrado" }
    );

    if (user.inQueueSince !== null)
      return reply.status(400).send(
        { message: "Você já está na fila de espera" }
      );

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        status: 'AVAILABLE',
        inQueueSince: new Date(),
      }
    });

    socket.to('plantao').emit('new_user_in_queue', user);

    reply.status(200).send();
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }
}

async function leaveQueue(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return reply.status(401).send(
      { message: "Token não informado" }
    );

    const { id } =
      jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) return reply.status(404).send(
      { message: "Usuário não encontrado" }
    );

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        status: 'OFFLINE',
        inQueueSince: null,
      }
    });

    reply.status(200).send();
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }
}

export {
  createUser,
  getProviders,
  getUser,
  getUsers,
  joinQueue,
  leaveQueue,
  me,
  toggleStatus,
  updateUser
};

