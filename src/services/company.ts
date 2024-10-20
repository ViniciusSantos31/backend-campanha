import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { createCompanySchema } from "../validations/company";
import { prisma } from "./prisma";


async function createCompany(request: FastifyRequest, reply: FastifyReply) {

  try {
    const company = createCompanySchema.parse(request.body);
    
    const isRegistered = await prisma.company.findFirst({
      where: {
        cnpj: company.cnpj,
      },
    });

    if (isRegistered) {
      return reply.status(409).send({
        message: "Já existe um organização com esse CNPJ."
      });
    }

    const companyCreated = await prisma.company.create({
      data: company,
    });
  
    reply.status(201).send({ id: companyCreated.id});
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

export { createCompany };
