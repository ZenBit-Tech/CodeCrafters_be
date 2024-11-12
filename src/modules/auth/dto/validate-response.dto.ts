import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TOKEN_EXAMPLE } from 'common/constants/strings';
import { Roles } from 'common/enums/enums';

export class ValidateResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: TOKEN_EXAMPLE,
    description: 'Auth token',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: Roles.ADMIN,
    description: 'Auth role',
  })
  role: Roles;
}
