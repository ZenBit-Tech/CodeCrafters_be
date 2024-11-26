import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Starbulka', description: 'Company name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'Client name' })
  client_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://company-logo', description: 'Company logo' })
  logo?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@email.com', description: 'Company email' })
  email: string;
}
