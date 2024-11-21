import { Controller, Get, Query, SetMetadata, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'common/enums/enums';
import { AuthGuard } from 'common/guards/auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard, AccessTokenInterface } from 'common/guards/userCompany.guard';
import { Request } from 'express';

import { UserResponseDto } from './dto/users-response.dto';
import { UserQueryParams } from './types';
import { UserService } from './user.service';

interface RequestWithUser extends Request {
  user: AccessTokenInterface;
}

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard, UserCompanyGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SetMetadata('roles', [Roles.ADMIN])
  @ApiOperation({ summary: 'Retrieve a list of users belonging to the same company' })
  @ApiQuery({ name: 'sortBy', description: 'Sorting criteria in JSON format', example: '{"full_name":"ASC"}' })
  @ApiQuery({ name: 'filterBy', description: 'Filter users by role', example: 'ADMIN' })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'search', description: 'Search string', example: 'John' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() queryParams: UserQueryParams, @Req() req: RequestWithUser): Promise<UserResponseDto> {
    const { user } = req;

    if (!user.company_id.id) {
      throw new BadRequestException('User information is missing');
    }

    const companyId = user.company_id.id;
    const { users, page, pagesCount } = await this.userService.findAll(queryParams, companyId);

    return { users, page, pagesCount };
  }
}
