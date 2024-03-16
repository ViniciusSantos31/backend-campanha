import app from './server';

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then((address) => {
  console.log(`Server listening at ${address}`);
})