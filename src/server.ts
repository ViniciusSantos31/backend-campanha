import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastify from "fastify";

import {
  authRoutes,
  companyRoutes,
  conferenceRoutes,
  recoveryPasswordRoutes,
  usersRoutes,
} from "./routes";
import { socket } from "./socket/server";

const app = fastify();

app.register(cors, {
  origin: "*",
  prefix: "/api",
});

app.register(multipart);

app.register(authRoutes);
app.register(companyRoutes);
app.register(usersRoutes);
app.register(conferenceRoutes);
app.register(recoveryPasswordRoutes);

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then((address) => {
    socket.attach(app.server);
    console.log(`Server listening at ${address}`);
  });

export default app;
