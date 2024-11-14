import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Roles } from 'common/enums/enums';

export class ValidateResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlN1cGVyIEFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMwMjE4MjM4LCJleHAiOjE3MzAyNjE0Mzh9.FEIULecy0FY7aJ5RnAYKErFWGcEHFpIM9AOWiqVwsLQ',
    description: 'Auth token',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: Roles.ADMIN,
    description: 'Auth role',
  })
  role: Roles;
}
