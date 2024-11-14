import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'jogn.dispatcher@gmail.com',
    description: 'Example email',
  })
  email: string;
}
