import { envVars } from "./env";

import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import { AppError } from "../helper/AppError";
import status from "http-status";

interface EmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: envVars.EMAIL.EMAIL_SENDER_SMTP_HOST,
  port: Number(envVars.EMAIL.EMAIL_SENDER_SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.EMAIL.EMAIL_SENDER_SMTP_USER,
    pass: envVars.EMAIL.EMAIL_SENDER_SMTP_PASSWORD,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  const { to, subject, templateName, templateData, attachments } = options;
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/templates/${templateName}.ejs`,
    );

    const template = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      to,
      subject: subject,
      html: template,
      attachments: attachments?.map((attachment) => {
        return {
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
        };
      }),
    });

    return { success: info.accepted.length > 0 };
  } catch (error: any) {
    console.log(error);
    throw new AppError(error.message, status.INTERNAL_SERVER_ERROR);
  }
};
