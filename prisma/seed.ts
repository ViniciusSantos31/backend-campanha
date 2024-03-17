import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCompany() {

  const company = await prisma.company.findFirst({
    where: {
      id: 'default_company'
    }
  })

  if (company) return;
  
  await prisma.company.create({
    data: {
      cnpj: "12345678901235",
      name: "PROCON",
      id: "default_company"
    }
  })
}

createCompany();