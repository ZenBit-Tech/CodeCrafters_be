import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Roles } from 'common/enums/enums';

export class AuthDriverOtpResponseDto {
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

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      id: 1,
      full_name: 'John Doe',
      email: 'john@gmail.com',
      phone_number: '+1234567890',
      companyId: 1,
      createdAt: '2024-12-09 20:55:07.564969',
      updatedAt: '2024-12-09 20:55:07.564969',
    },
    description: 'Driver data',
  })
  user: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    companyId: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
