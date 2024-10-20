import { z } from 'zod';
import { } from "zod-form-data";
const createUserSchema = z.object({
  firstName: z.string().min(3, "Primeiro nome muito curto").max(255),
  lastName: z.string().min(3, "Último nome muito curto").max(255),
  email: z.string().email(),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(255),
  phone: z.string().min(10, "O número de telefone deve ter no mínimo 10 digitos").max(15, "O número de telefone deve ter no máximo 15 digitos"),
  userType: z.enum(['REQUESTER', 'PROVIDER']).default('REQUESTER').optional(),
  status: z.enum(['AVAILABLE', 'OFFLINE', 'PAUSED', 'BUSY']).default('OFFLINE').optional(),
  doc: z.string().min(10, "O documento deve ter no mínimo 10 dígitos").max(255, "O documento deve ter no máximo 255 dígitos").optional(),
  cpf: z.string().min(11, "O CPF deve conter 11 dígitos").max(11, "O CPF deve conter 11 dígitos"),
  companyId: z.string().min(10).max(255),
});

const paramsUserSchema = z.object({
  id: z.string({
    invalid_type_error: "O id deve ser uma string",
  }).uuid(),
});

const editUserSchema = z.object({
  firstName: z.string().min(3, "Primeiro nome muito curto").max(255).optional(),
  lastName:z.string().min(3, "Último nome muito curto").max(255).optional(),
  email:z.string().email().optional(),
  avatarUrl:z.string().url().optional()
});

export { createUserSchema, editUserSchema, paramsUserSchema };
