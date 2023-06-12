const template = require("../template");
import nodemailer from "nodemailer";
import { Email, Host, Password } from "../config";
export default class EmailService {
  public emailSend({
    emails,
    subject,
    message,
    link,
  }: {
    emails: string;
    subject: string;
    message: string;
    link?: string;
  }): any {
    const emailCredentials = {
      from: `TECH_SCI_VERSE <${Email}>`,
      to: emails,
      subject: subject,
      html: link
        ? template.linkEmail(message, link)
        : template.normalMailBody(message),
    };
    return new Promise((resolve, reject) => {
      const transport = nodemailer.createTransport({
        service: Host,
        auth: {
          user: Email,
          pass: Password,
        },
      });
      transport
        .sendMail(emailCredentials)
        .then((info) => {
          return resolve(info);
        })
        .catch((err) => {
          return resolve(err);
        });
    });
  }
}
