import bycript from 'bcrypt';
import { FastifyReply, FastifyRequest } from "fastify";
import { transporter } from "../lib/nodemailer";
import { prisma } from "./prisma";

import { template } from '../template/email';

async function sendEmail(request: FastifyRequest, reply: FastifyReply) {

  try {

    const { email } = request.body as { email: string };

    
    // const template = fs.readFileSync('./src/template/email.html', 'utf8');
    // const parseTemplate = Handlebars.compile(template);

    // console.log(parseTemplate({ code: 1234 }))

    const userExists = await prisma.user.findFirst({
      where: {
        email,
      }
    });
  
    const otpExists = await prisma.otp.findFirst({
      where: {
        user: {
          email
        }
      }
    });

    if (!userExists)
      return reply.status(404).send(
        { message: 'Este e-mail não está cadastrado na nossa plataforma' }
      );

    const otpCode = Math.floor(1000 + Math.random() * 9000);

    if (otpExists)
      await prisma.user.update({
        where: {
          email: userExists.email
        },
        data: {
          otp: {
            delete: true
          },
        }
      });

    const code = await prisma.otp.create({
      data: {
        code: otpCode,
        userId: userExists.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2) // 2 horas
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'vncssnts31@gmail.com',
      subject: `[Plantão] Seu código de verificação - ${code.code}`,
      html: template.replace('{{code}}', code.code.toString())
    }).then(() => {
      console.log('E-mail enviado com sucesso');
    }).catch((error) => { 
      console.log(`Erro ao enviar e-mail: ${error.message}`);
    });

    reply.send({ id: code.id });
  }
  catch (error) {
    console.log(error);
  }
}

async function verifyCode(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { code } = request.body as { code: number };

    const user = await prisma.user.findFirst({
      where: {
        otp: {
          code,
        }
      }
    });

    const otp = await prisma.otp.findFirst({
      where: {
        code,
        user: {
          email: user?.email
        }
      }
    });

    if (!otp)
      return reply.status(404).send({ message: 'Código inválido' });

    if (otp.expiresAt < new Date())
      return reply.status(400).send({ message: 'Código expirado' });

    reply.send({ message: 'Código válido' });
  }
  catch (error) {
    console.log(error);
  }
}

async function resendCode(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email } = request.body as { email: string };

    const { codeId } = request.params as { codeId: string };

    const otp = await prisma.otp.findFirst({
      where: {
        id: codeId,
        user: {
          email
        }
      }
    });

    if (!otp)
      return reply.status(404).send({ message: 'Código inválido' });

    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    if (!user)
      return reply.status(404).send({ message: 'Usuário não encontrado' });

    const otpCode = Math.floor(1000 + Math.random() * 9000);

    const code = await prisma.otp.update({
      where: {
        userId: user.id
      },
      data: {
        code: otpCode,
        expiresAt: new Date(Date.now() + 60000)
      }
    });

    await transporter.sendMail({
      from: '',
      to: email,
      subject: 'Testando e-mail de senha',
      text: otpCode.toString(),
    });

    reply.send({ code });
  }
  catch (error) {
    console.log(error);
  }
}

async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { password } =
      request.body as { password: string };
    
    const { codeId } = request.params as { codeId: string };

    const otp = await prisma.otp.findFirst({
      where: {
        id: codeId,
      }
    });

    if (!otp)
      return reply.status(404).send({ message: 'Código inválido' });

    const passwordHash = await bycript.hash(password, 8);

    await prisma.user.update({
      where: {
        id: otp.userId,
      },
      data: {
        password: passwordHash,
        otp: {
          delete: true
        }
      }
    });

    return reply.send({ message: 'Senha alterada com sucesso' });
  }
  catch (error) {
    console.log(error);
  }
}

async function verifyCodeId(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { codeId } = request.params as { codeId: string };

    const otp = await prisma.otp.findFirst({
      where: {
        id: codeId,
        AND: {
          expiresAt: {
            gt: new Date()
          }
        }
      }
    });

    if (!otp)
      return reply.status(404).send({ message: 'Código inválido' });

    return reply.send({ message: 'Código válido' });
  }
  catch (error) {
    console.log(error);
  }
}

export { changePassword, resendCode, sendEmail, verifyCode, verifyCodeId };

