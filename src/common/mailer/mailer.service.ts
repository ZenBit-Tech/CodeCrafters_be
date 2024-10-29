import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { Address } from 'nodemailer/lib/mailer';

interface MailDto {
  from?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacements: Record<string, string>;
}

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}
  mailTransport() {
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

  async sendEmail(dto: MailDto) {
    const { from, recipients, subject, html } = dto;

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
      return await transport.sendMail(options);
    } catch (error) {
      return InternalServerErrorException;
    }
  }
}
