import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDriverResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '121345',
    description: 'Auth code for driver',
  })
  otp: string;
}
