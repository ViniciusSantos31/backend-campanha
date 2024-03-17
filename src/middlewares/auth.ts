import { FastifyReply, FastifyRequest } from "fastify";

async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const token = request.headers.authorization;

  if (!token) {
    return reply.status(401).send({ message: "Token não fornecido" });
  }

}

export { authMiddleware };
