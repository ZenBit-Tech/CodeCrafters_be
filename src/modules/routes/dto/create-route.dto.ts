import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RouteStatuses } from 'common/enums/enums';

export class CreateRouteDto {
  @ApiProperty({
    example: '2024-11-25T15:30:00Z',
    description: 'The submission date of the route in ISO 8601 format',
  })
  @IsDateString()
  @IsNotEmpty()
  submission_date: Date;

  @ApiProperty({
    example: '2024-11-27T15:30:00Z',
    description: 'The arrival date of the route in ISO 8601 format',
  })
  @IsDateString()
  @IsNotEmpty()
  arrival_date: Date;

  @ApiProperty({
    example: 150.5,
    description: 'The distance of the route in kilometers',
  })
  @IsNumber()
  @IsNotEmpty()
  distance: number;

  @ApiProperty({
    example: RouteStatuses.FAILED,
    description: 'The status of the route (e.g., PENDING, COMPLETED, CANCELED)',
    enum: RouteStatuses,
  })
  @IsEnum(RouteStatuses)
  @IsNotEmpty()
  status: RouteStatuses;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user associated with the route',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    example: 2,
    description: 'The ID of the company associated with the route',
  })
  @IsNumber()
  @IsNotEmpty()
  company_id: number;
}
