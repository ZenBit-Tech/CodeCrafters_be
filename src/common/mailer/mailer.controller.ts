import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MailerResponseDto } from './dto/mailer-response.dto';
import { CreateMailDto } from './dto/send-mail.dto';
import { MailerService } from './mailer.service';

@ApiBearerAuth()
@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/invitation')
  @ApiOperation({ summary: 'Sending invitation mail to user' })
  @ApiResponse({ status: 200, type: MailerResponseDto })
  async sendMail(@Body() mailDto: CreateMailDto) {
    return this.mailerService.sendEmail(mailDto);
  }
}
