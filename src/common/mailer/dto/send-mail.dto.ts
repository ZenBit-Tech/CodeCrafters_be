import { IsNotEmpty, IsString } from 'class-validator';
import { Address } from 'nodemailer/lib/mailer';

export class SendMailDto {
  from?: Address;

  @IsNotEmpty()
  recipients: Address[];

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  html: string;

  @IsString()
  text?: string;

  placeholderReplacements: Record<string, string>;
}
