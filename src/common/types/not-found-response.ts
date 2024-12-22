import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponse {
  @ApiProperty({ example: 404, description: 'response status' })
  status: number;

  @ApiProperty({ example: new NotFoundException('There is no such route').getResponse(), description: 'response error (optional)' })
  error?: unknown;
}
