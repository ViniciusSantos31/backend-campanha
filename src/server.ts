import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastify from "fastify";

import { authRoutes, companyRoutes, usersRoutes } from './routes';

import { uploadImage } from "./services/images";
import { socket } from "./socket/server";

const app = fastify();

app.register(cors, {
  origin: '*'
});

app.register(multipart);

app.register(authRoutes);
app.register(companyRoutes);
app.register(usersRoutes);

app.post('/images/:id', uploadImage);

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then((address) => {  
  socket.attach(app.server).emit('hello', 'world');
  console.log(`Server listening at ${address}`);
});


export default app;