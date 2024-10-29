import { Controller, Post } from '@nestjs/common';

import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/invitation')
  async sendMail() {
    const mailDto = {
      from: { name: 'codecrafters', address: 'codecrafters@mail.com' },
      recipients: [{ name: 'john', address: 'morozovalex842@gmail.com' }],
      subject: 'invitation link',
      html: '<a href="http://asd">invitation link</a>',
      placeholderReplacements: {},
    };

    return this.mailerService.sendEmail(mailDto);
  }
}
