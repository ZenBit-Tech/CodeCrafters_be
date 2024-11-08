import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class FailedResponse {
  @ApiProperty({ example: 400, description: 'response status' })
  status: number;

  @ApiProperty({ example: new BadRequestException('There is no such company').getResponse(), description: 'response error (optional)' })
  error?: unknown;
}
