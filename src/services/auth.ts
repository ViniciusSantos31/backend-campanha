import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import jwt from 'jsonwebtoken';

import bycript from 'bcrypt';
import { socket } from "../socket/server";
import { exclude } from "../utils/excludeField";
import { loginSchema } from "../validations/auth";

const prisma = new PrismaClient();

async function login(request: FastifyRequest, reply: FastifyReply) {

  try {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    if (!user)
      return reply.status(404).send({ message: "Usuário não encontrado" });

    const passwordMatch = await bycript.compare(password, user.password);

    if (!passwordMatch)
      return reply.status(401).send({ message: "Senha inválida" });

    if (user.userType === 'PROVIDER') await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        ...user,
        status: 'PAUSED'
      }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', {
      expiresIn: '1m'
    });

    socket.emit("user_login");
  
    reply.send({ token, user: exclude(user, ['password']) });
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

async function logout(request: FastifyRequest, reply: FastifyReply) {

  try {

    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token)
      return reply.status(401).send({ message: 'Token não informado' });

    const { id } =
      jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };


    if (!id)
      return reply.status(401).send({ message: 'Token inválido' });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: 'OFFLINE'
      }
    });

    socket.emit("user_logout");

    reply.send({ message: 'Logout realizado com sucesso' });

  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }

}

export { login, logout };

