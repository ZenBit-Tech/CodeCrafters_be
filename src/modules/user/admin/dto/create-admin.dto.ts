import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from 'common/enums/enums';

export class CreateAdminDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://logo-path', description: 'admin logo' })
  logo: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'admin full name' })
  full_name: string;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com', description: 'admin email' })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: Roles.ADMIN, description: 'admin role' })
  role: Roles;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 15, description: 'admin company id' })
  company_id: number;
}
