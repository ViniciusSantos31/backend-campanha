import { z } from "zod";
import {} from "zod-form-data";
const createGuestUserSchema = z.object({
  firstName: z.string().min(3, "Primeiro nome muito curto").max(255),
  lastName: z.string().min(3, "Último nome muito curto").max(255),
  companyId: z.string().min(10).max(255).default("default_company"),
});

export { createGuestUserSchema };
