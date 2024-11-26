import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from 'common/enums/enums';

export class CreateDispatcherDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '+380931234567',
    description: 'dispatcher phone number',
  })
  phone_number: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'dispatcher full name' })
  full_name: string;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com', description: 'dispatcher email' })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: Roles.ADMIN, description: 'dispatcher role' })
  role: Roles.DISPATCHER;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 15, description: 'dispatcher company id' })
  company_id: number;
}
