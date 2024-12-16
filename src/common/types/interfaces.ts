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

export interface ResponseInterface {
  status: number;
  message?: string;
  error?: unknown;
}

export interface OrderWithRouteAndCustomer {
  orderId: number;
  routeId: number;
  collectionTimeStart: Date;
  collectionTimeEnd: Date;
  customerName: string;
  customerPhone: string | null;
}

export interface EmailContent {
  fullName?: string;
  companyName?: string;
  additionalInfo?: string;
}

export interface EmailTemplateProps {
  content: EmailContent;
  footerEmail: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  otp?: string;
  token?: string;
}
