import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { isEmail } from 'class-validator';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<string | BadRequestException> {
    if (isEmail(email)) {
      return this.authService.authByEmail(email);
    }

    return new BadRequestException();
  }
}
