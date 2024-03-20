import { FastifyReply, FastifyRequest } from 'fastify';

import { createWriteStream } from 'fs';
import { bucket } from '../firebase';
import { paramsUserSchema } from '../validations/user';
import { prisma } from './prisma';



async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  try {

    const images = await bucket.getFiles();
    const file = await request.file();

    const { id } = paramsUserSchema.parse(request.params);

    const user = await prisma.user.findFirst({
      where: {
        id,
      }
    });

    if (!user) {
      reply.status(404).send({ message: 'Usuário não encontrado.' });
      return;
    }

    if (!file) {
      reply.status(400).send({ message: 'No file uploaded' });
      return;
    }

    const writeFile = await file.toBuffer();
    createWriteStream(`./images/${file.filename}`).write(writeFile);
    
    const [image] = await bucket.upload(`./images/${file.filename}`, {
      destination: file.filename,
      metadata: {
        contentType: file.mimetype,
      },
    });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        avatarUrl: `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${file.filename}?alt=media`,
      },
    });

    reply.code(204);
  }
  catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ message: error.message });
    }
  }
}

export { uploadImage };
