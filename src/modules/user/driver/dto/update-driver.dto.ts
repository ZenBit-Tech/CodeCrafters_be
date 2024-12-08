import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDriverDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '+380931234567',
    description: 'driver phone number',
  })
  phone_number: string;

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
}
