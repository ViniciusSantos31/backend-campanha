import cors from "@fastify/cors";
import fastify from "fastify";

import { companyRoutes, usersRoutes } from './routes';

const app = fastify();

app.register(cors, {
  origin: '*'
});

app.register(usersRoutes);
app.register(companyRoutes);

export default app;