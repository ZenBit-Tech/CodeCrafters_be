import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminDto {
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
}
