import { z } from 'zod';

const createConferenceSchema = z.object({
  providerId: z.string().uuid('Id do consultor inválido'),
});

const paramsConferenceSchema = z.object({
  id: z.string().uuid(),
});

const editConferenceSchema = createConferenceSchema.partial();

export { createConferenceSchema, editConferenceSchema, paramsConferenceSchema };
