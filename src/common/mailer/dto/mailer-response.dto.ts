import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MailerResponseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 200,
    description: 'status',
  })
  status: 200;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Message was successfully sent',
    description: 'status',
  })
  message: string;
}
