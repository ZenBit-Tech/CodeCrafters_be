import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RouteStatuses } from 'common/enums/enums';

export class UpdateRouteStatusDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'driver id' })
  driverId: number;

  @Expose()
  @IsEnum(RouteStatuses, { each: true })
  @IsNotEmpty()
  @ApiProperty({ example: RouteStatuses.ON_TIME, description: 'Route status for update' })
  status: RouteStatuses;
}
