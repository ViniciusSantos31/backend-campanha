import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(3, "Nome da organização muito curto").max(255),
  cnpj: z.string().min(14, "O CNPJ deve ter no mínimo 14 dígitos").max(14, "O CNPJ deve ter no máximo 14 dígitos"),
});

const editCompanySchema = createCompanySchema.partial();

export { createCompanySchema, editCompanySchema };
