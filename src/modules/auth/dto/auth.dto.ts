import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { EMAIL_EXAMPLE } from 'common/constants/strings';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: EMAIL_EXAMPLE,
    description: 'Example email',
  })
  email: string;
}
