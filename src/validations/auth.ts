import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").max(255),
});

const headersLoginSchema = z.object({
  token: z.string(),
});

export { headersLoginSchema, loginSchema };

