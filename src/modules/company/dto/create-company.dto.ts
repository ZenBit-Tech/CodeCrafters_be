import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Starbulka', description: 'Company name' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'https://company-logo', description: 'Company logo' })
  logo?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@email.com', description: 'Company email' })
  email: string;
}
