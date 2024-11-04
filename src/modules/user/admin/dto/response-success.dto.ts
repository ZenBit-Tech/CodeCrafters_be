import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({ example: 200, description: 'response status' })
  status: number;

  @ApiProperty({ example: 'User created successfully', description: 'response message (optional)' })
  message?: string;
}
