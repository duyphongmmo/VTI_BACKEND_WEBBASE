import * as dotenv from 'dotenv';

dotenv.config();

export class MailConfig {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      username: process.env.MAIL_USERNAME,
      password: process.env.MAIL_PASSWORD,
      noReply: process.env.MAIL_NO_REPLY,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
