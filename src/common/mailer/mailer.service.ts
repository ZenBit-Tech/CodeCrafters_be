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
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
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
