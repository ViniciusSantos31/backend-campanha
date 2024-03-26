import { User } from '@prisma/client';
import 'dotenv/config';
import { Server } from 'socket.io';

const socket = new Server({
  cors: {
    origin: "*",
  }
});

socket.on('connection', (socket) => {
  socket.join('plantao');

  socket.to('plantao').emit('new_connection', socket.id);

  socket.on('disconnect', () => {
    socket.to('plantao').emit('user_disconnected', socket.id);
    socket.leave('plantao');
  });

  socket.on('user_connected', (user: User) => { 

    const { userType } = user;

    if (userType === 'PROVIDER') {
      socket.join('providers');
    } else {
      socket.join('requesters');
    }
  });
});

export { socket };
