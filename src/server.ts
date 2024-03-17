import cors from "@fastify/cors";
import fastify from "fastify";

import { authRoutes, companyRoutes, usersRoutes } from './routes';
import "./socket/server";

const app = fastify();

app.register(cors, {
  origin: '*'
});


app.register(authRoutes);
app.register(companyRoutes);
app.register(usersRoutes);


export default app;