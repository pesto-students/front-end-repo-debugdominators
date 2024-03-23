import nodemailer from "nodemailer";
import { email } from "@/constants/service";
import { SendEmailProps } from "../types/service";

const { SERVICE, HOST } = email;
const { SENDER_EMAIL, GMAIL_APP_PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
  service: SERVICE,
  host: HOST,
  auth: {
    user: SENDER_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  subject = "BLOGMIGLE APP ALERT",
  html,
  email,
}: SendEmailProps) {
  const info = await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject,
    html,
    // html: `<b>Hello world? <a href="http://localhost:3000/api/auth/verifyemail?token=${token}">click here<a/> </b>`,
  });
  return info.messageId;
}
