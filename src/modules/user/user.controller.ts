import { Controller, Delete, Get, Param, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserCompanyGuard } from 'common/guards/userCompany.guard';

import { UserResponseDto } from './dto/users-response.dto';
import { UserQueryParams } from './types';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(RolesGuard, UserCompanyGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Retrieve a list of users belonging to the same company' })
  @ApiQuery({ name: 'sortBy', description: 'Sorting criteria in JSON format', example: '{"full_name":"ASC"}' })
  @ApiQuery({ name: 'filterBy', description: 'Filter users by role', example: 'ADMIN' })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'search', description: 'Search string', example: 'John' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() queryParams: UserQueryParams): Promise<UserResponseDto> {
    return this.userService.findAll(queryParams);
  }

  @Delete(':id')
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
