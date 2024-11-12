import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TOKEN_EXAMPLE } from 'common/constants/strings';

export class AuthResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: TOKEN_EXAMPLE,
    description: 'Auth token',
  })
  token: string;
}
