import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from 'common/enums/enums';

export class CreateDriverDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://logo-path', description: 'driver logo' })
  logo: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'driver full name' })
  full_name: string;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com', description: 'driver email' })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: Roles.DRIVER, description: 'driver role' })
  role: Roles.DRIVER;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 15, description: 'dispatcher company id' })
  company_id: number;
}
