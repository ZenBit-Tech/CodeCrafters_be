import { Address } from 'nodemailer/lib/mailer';

export interface Error {
  statusCode: number;
  error: string;
  messagages: string[];
}

export interface SendEmailInterface {
  from?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacements: Record<string, string>;
}
