import { BadRequestException, Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isEmail } from 'class-validator';
import { Roles } from 'common/enums/enums';
import { AuthGuard } from 'common/guards/auth.guard';
import { SuccessResponse } from 'common/types/response-success.dto';

import { AuthService } from './auth.service';
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
}
