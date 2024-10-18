import { FastifyReply, FastifyRequest } from "fastify";

import { socket } from "../socket/server";
import { createConferenceSchema } from "../validations/conference";
import { prisma } from "./prisma";
import { wiseAPI } from "./wiseAPI";

async function createConference(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { providerId } = createConferenceSchema.parse(request.body);

    const provider = await prisma.user.findFirst({
      where: {
        id: providerId,
        userType: "PROVIDER",
      },
    });

    if (!provider || provider.status !== "AVAILABLE")
      return reply
        .status(404)
        .send({ message: "Consultor não encontrado ou não disponível." });

    const providersInQueue = await prisma.user.findFirst({
      where: {
        status: "AVAILABLE",
        AND: {
          userType: "PROVIDER",
        },
      },
      orderBy: {
        inQueueSince: "asc",
      },
    });

    if (providersInQueue && providersInQueue.id !== provider.id) {
      return reply
        .status(400)
        .send({ message: "Existem consultores na fila antes de você." });
    }

    let conferenceOpen = await prisma.conference.findFirst({
      where: {
        providerId,
        AND: {
          status: "OPEN",
        },
      },
    });

    if (conferenceOpen) {
      const statusConference = (
        await (await wiseAPI).session.get(conferenceOpen.short)
      ).session.status;

      if (statusConference === "CLOSED") {
        conferenceOpen = await prisma.conference.update({
          where: {
            id: conferenceOpen.id,
          },
          data: {
            status: "FINISHED",
          },
        });
      }
    } else {
      const session = await (
        await wiseAPI
      ).session
        .create({
          org: process.env.WISE_ORG as string,
          orgUnit: process.env.WISE_ORG_UNIT as string,
          allowTranscription: false,
          allowRegistryDLT: false,
        })
        .catch((error) => {
          return reply.status(500).send({
            message: `Erro ao criar sessão de conferência: ${JSON.stringify(
              error.message,
              null,
              2
            )}`,
          });
        });

      conferenceOpen = await prisma.conference.create({
        data: {
          short: session.short,
          providerId: provider.id,
        },
      });
    }

    await prisma.user.update({
      where: {
        id: provider.id,
      },
      data: {
        status: "BUSY",
      },
    });

    socket.emit("user_status_changed", provider.id);

    const usersInQueue = await prisma.user.findMany({
      where: {
        status: "AVAILABLE",
        AND: {
          userType: "REQUESTER",
        },
      },
      orderBy: {
        inQueueSince: "asc",
      },
    });

    const guestsInQueue = await prisma.guestUser.findMany({
      where: {
        status: "AVAILABLE",
      },
      orderBy: {
        inQueueSince: "asc",
      },
    });

    const olderUser = [...usersInQueue, ...guestsInQueue].sort((a, b) => {
      if (!a.inQueueSince || !b.inQueueSince) return 0;
      return a.inQueueSince.getTime() - b.inQueueSince.getTime();
    })[0];

    console.log(guestsInQueue);

    socket.emit("conference_created", {
      short: conferenceOpen.short,
      userToCall: olderUser,
      providerToCall: provider,
    });

    reply.send({ conferenceOpen });
  } catch (error) {
    if (error instanceof Error)
      reply.status(500).send({ message: error.message });
  }
}

async function closeConference(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { short } = request.params as { short: string };

    const { providerId } = request.body as { providerId: string };

    const conference = await prisma.conference.findFirst({
      where: {
        short,
        AND: {
          providerId,
        },
      },
    });

    if (!conference)
      return reply.status(404).send({ message: "Conferência não encontrada." });

    await prisma.conference.update({
      where: {
        id: conference.id,
      },
      data: {
        status: "FINISHED",
      },
    });

    await prisma.user.update({
      where: {
        id: providerId,
      },
      data: {
        status: "PAUSED",
      },
    });

    socket.emit("user_status_changed", providerId);

    reply.send({ message: "Conferência encerrada com sucesso." });
  } catch (error) {
    if (error instanceof Error)
      reply.status(500).send({ message: error.message });
  }
}

export { closeConference, createConference };
