import { ApiProperty } from '@nestjs/swagger';
import { User } from 'common/database/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ type: [User], description: 'List of users' })
  users: User[];

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  pagesCount: number;
}
