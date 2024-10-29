import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isEmail } from 'class-validator';

import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { BadRequestResponseDto } from './dto/bad-request.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':email')
  @ApiOperation({ summary: 'Get token by email' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  async findOne(@Param('email') email: string): Promise<{ token: string } | BadRequestException> {
    if (isEmail(email)) {
      return this.authService.authByEmail(email);
    }

    throw new BadRequestException("String isn't email");
  }
}
