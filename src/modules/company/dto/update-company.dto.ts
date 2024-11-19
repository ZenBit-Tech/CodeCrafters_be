import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Starbulka', description: 'Company name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://company-logo', description: 'Company logo' })
  logo?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@email.com', description: 'Company email' })
  email?: string;
}
