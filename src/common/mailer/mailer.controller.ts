import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { CreateMailDto } from './dto/send-mail.dto';
import { MailerService } from './mailer.service';

@ApiExcludeController()
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/invitation')
  async sendMail(@Body() mailDto: CreateMailDto) {
    return this.mailerService.sendEmail(mailDto);
  }
}
