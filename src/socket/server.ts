import 'dotenv/config';
import { Server } from 'socket.io';

const socket = new Server({
  cors: {
    origin: "*",
  }
});

socket.on('connection', (socket) => {
  socket.join(["plantao"]);
  socket.rooms.add(socket.id);

  console.log('New user connected', socket.id);

  socket.broadcast.emit('new_connection', socket.id);
});

socket.listen(process.env.PORT ? Number(process.env.PORT) : 3000, {
  transports: ['websocket'],
});

export { socket };
