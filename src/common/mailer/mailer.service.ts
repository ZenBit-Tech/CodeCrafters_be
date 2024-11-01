import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailInterface } from 'common/types/interfaces';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> {
    return nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: this.configService.getOrThrow<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(newMailDto: SendEmailInterface): Promise<{ status: number; message: string }> {
    const { from, recipients, subject, html } = newMailDto;
    const transport = this.mailTransport();

    const options: MailOptions = {
      from: from ?? {
        name: this.configService.getOrThrow<string>('APP_NAME') || 'LogisticApp',
        address: this.configService.getOrThrow<string>('DEFAULT_EMAIL_FROM') || 'codecrafters@team.com',
      },
      to: recipients,
      subject,
      html,
    };

    try {
      await transport.sendMail(options);
      return { status: 200, message: 'Message was successfully sent' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
