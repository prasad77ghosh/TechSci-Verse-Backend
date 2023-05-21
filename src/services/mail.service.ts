const template = require("../template");
import nodemailer from "nodemailer";
import { Email, Host, Password } from "../config";
export default class EmailService {
  public mailSend({
    email,
    subject,
    message,
    link,
  }: {
    email: string;
    subject: string;
    message: string;
    link?: string;
  }): any {
    const emailCredentials = {
      from: `MY-BLOG <${email}>`,
      to: email,
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
        .catch((error) => {
          return reject(error);
        });
    });
  }
}
