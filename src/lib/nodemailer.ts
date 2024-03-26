import nodemailer from 'nodemailer';

const mailConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_TLS === 'true',
  name: process.env.EMAIL_NAME,
  from: process.env.EMAIL_FROM,
  authMethod: 'plain',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH'
  },
}

export const transporter = nodemailer.createTransport(mailConfig);

transporter.verify().then(() => {
  console.log('Conexão com o servidor de e-mails realizada com sucesso');
}).catch((error) => {
  console.log(`Erro ao conectar com o servidor de e-mails: ${error.message}`);
});


