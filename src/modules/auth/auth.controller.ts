import { BadRequestException, Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isEmail } from 'class-validator';
import { Roles } from 'common/enums/enums';
import { AuthGuard } from 'common/guards/auth.guard';
import { SuccessResponse } from 'common/types/response-success.dto';

import { AuthService } from './auth.service';
import { AuthDriverResponseDto } from './dto/auth-driver-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { BadRequestResponseDto } from './dto/bad-request.dto';
import { ValidateResponse } from './dto/validate-response.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':email')
  @ApiOperation({ summary: 'Get token by email' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  async findOne(@Param('email') email: string): Promise<SuccessResponse> {
    if (isEmail(email)) {
      return this.authService.authByEmail(email);
    }

    throw new BadRequestException("String isn't email");
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Validate token' })
  @ApiResponse({ status: 200, type: ValidateResponse })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  validateAccessToken(@Headers('role') role: Roles, @Headers('authorization') authorization: string): { token: string; role: Roles } {
    return this.authService.tokenValidation(authorization, role);
  }

  @Get('driver/:email')
  @ApiOperation({ summary: 'Get otp code by email' })
  @ApiResponse({ status: 200, type: AuthDriverResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  async findOneDriver(@Param('email') email: string): Promise<SuccessResponse> {
    if (isEmail(email)) {
      return this.authService.authDriverByEmail(email);
    }

    throw new BadRequestException("String isn't email");
  }

  @Post('driver/otp-verify')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, type: ValidateResponse })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string): Promise<{ token: string; role: Roles }> {
    return this.authService.verifyDriverOtp(email, otp);
  }
}
