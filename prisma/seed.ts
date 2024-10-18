import { PrismaClient } from "@prisma/client";
import bycript from "bcrypt";

const prisma = new PrismaClient();

async function createCompany() {
  const company = await prisma.company.findFirst({
    where: {
      id: "default_company",
    },
  });

  if (company) return;

  await prisma.company.create({
    data: {
      cnpj: "12345678901235",
      name: "PROCON",
      id: "default_company",
    },
  });
}

async function createProviders() {
  const provider = await prisma.user.findFirst({
    where: {
      id: "default_provider",
    },
  });

  if (provider) return;

  const passwordHash = await bycript.hash("senha123", 8);

  await prisma.user.create({
    data: {
      cpf: "12345678901",
      email: "provider@email.com",
      firstName: "Provider",
      lastName: "Test",
      phone: "123456789",
      companyId: "default_company",
      userType: "PROVIDER",
      doc: "12345678901",
      password: passwordHash,
    },
  });
}

createProviders();
createCompany();
